import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { ApiKey } from "../../.medusa/types/query-entry-points";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => {
              return {
                currency_code: currency.currency_code,
                is_default: currency.is_default ?? false,
              };
            }
          ),
        },
      };
    });

    const stores = updateStoresStep(normalizedInput);

    return new WorkflowResponse(stores);
  }
);

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  const countries = ["us", "gb", "de", "dk", "se", "fr", "es", "it"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        {
          currency_code: "usd",
          is_default: true,
        },
        {
          currency_code: "eur",
        },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });
  logger.info("Seeding region data...");
  const regionModuleService = container.resolve(Modules.REGION);
  const existingRegions = await regionModuleService.listRegions();
  const existingRegionNames = existingRegions.map((r: { name: string }) => r.name);

  const regionsToCreate = [
    {
      name: "United States",
      currency_code: "usd",
      countries: ["us"],
      payment_providers: ["pp_system_default"],
    },
    {
      name: "Europe",
      currency_code: "eur",
      countries: ["gb", "de", "dk", "se", "fr", "es", "it"],
      payment_providers: ["pp_system_default"],
    },
  ].filter((r) => !existingRegionNames.includes(r.name));

  let allRegions = [...existingRegions];
  if (regionsToCreate.length > 0) {
    const { result: newRegions } = await createRegionsWorkflow(container).run({
      input: { regions: regionsToCreate },
    });
    allRegions = [...existingRegions, ...newRegions];
  }

  const region =
    allRegions.find((r: { name: string }) => r.name === "United States") ||
    allRegions[0];
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  const taxModuleService = container.resolve(Modules.TAX);
  const existingTaxRegions = await taxModuleService.listTaxRegions();
  const existingTaxCountryCodes = existingTaxRegions.map(
    (tr: { country_code: string }) => tr.country_code
  );
  const taxCountriesToCreate = countries.filter(
    (c) => !existingTaxCountryCodes.includes(c)
  );
  if (taxCountriesToCreate.length > 0) {
    await createTaxRegionsWorkflow(container).run({
      input: taxCountriesToCreate.map((country_code) => ({
        country_code,
        provider_id: "tp_system",
      })),
    });
  }
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION);
  const existingLocations = await stockLocationModuleService.listStockLocations(
    { name: "MorphFit US Warehouse" }
  );
  let stockLocation: { id: string };
  if (existingLocations.length) {
    stockLocation = existingLocations[0];
  } else {
    const { result: stockLocationResult } =
      await createStockLocationsWorkflow(container).run({
        input: {
          locations: [
            {
              name: "MorphFit US Warehouse",
              address: {
                city: "Los Angeles",
                country_code: "US",
                address_1: "",
              },
            },
          ],
        },
      });
    stockLocation = stockLocationResult[0];

    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: { default_location_id: stockLocation.id },
      },
    });

    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
    });
  }

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [{ name: "Default Shipping Profile", type: "default" }],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const existingFulfillmentSets =
    await fulfillmentModuleService.listFulfillmentSets({
      name: "MorphFit US Shipping",
    });
  let fulfillmentSet: { id: string; service_zones: { id: string }[] };
  if (existingFulfillmentSets.length) {
    fulfillmentSet = existingFulfillmentSets[0] as typeof fulfillmentSet;
  } else {
    fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "MorphFit US Shipping",
      type: "shipping",
      service_zones: [
        {
          name: "United States",
          geo_zones: [{ country_code: "us", type: "country" }],
        },
      ],
    });

    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
    });

    const existingShippingOptions =
      await fulfillmentModuleService.listShippingOptions({
        service_zone_id: fulfillmentSet.service_zones[0].id,
      });

    if (!existingShippingOptions.length) {
      await createShippingOptionsWorkflow(container).run({
        input: [
          {
            name: "Standard Shipping",
            price_type: "flat",
            provider_id: "manual_manual",
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: shippingProfile.id,
            type: {
              label: "Standard",
              description: "Ship in 2-3 days.",
              code: "standard",
            },
            prices: [
              { currency_code: "usd", amount: 10 },
              { currency_code: "eur", amount: 10 },
              { region_id: region.id, amount: 10 },
            ],
            rules: [
              { attribute: "enabled_in_store", value: "true", operator: "eq" },
              { attribute: "is_return", value: "false", operator: "eq" },
            ],
          },
          {
            name: "Express Shipping",
            price_type: "flat",
            provider_id: "manual_manual",
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: shippingProfile.id,
            type: {
              label: "Express",
              description: "Ship in 24 hours.",
              code: "express",
            },
            prices: [
              { currency_code: "usd", amount: 10 },
              { currency_code: "eur", amount: 10 },
              { region_id: region.id, amount: 10 },
            ],
            rules: [
              { attribute: "enabled_in_store", value: "true", operator: "eq" },
              { attribute: "is_return", value: "false", operator: "eq" },
            ],
          },
        ],
      });
    }
  }
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  let publishableApiKey: ApiKey | null = null;
  const { data } = await query.graph({
    entity: "api_key",
    fields: ["id"],
    filters: {
      type: "publishable",
    },
  });

  publishableApiKey = data?.[0];

  if (!publishableApiKey) {
    const {
      result: [publishableApiKeyResult],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "Webshop",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    });

    publishableApiKey = publishableApiKeyResult as ApiKey;
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");

  logger.info("Seeding product data...");

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        { name: "Protein", handle: "protein", is_active: true },
        { name: "Pre-Workout", handle: "pre-workout", is_active: true },
        { name: "Vitamins", handle: "vitamins", is_active: true },
        { name: "Accessories", handle: "accessories", is_active: true },
      ],
    },
  });

  const proteinCatId = categoryResult.find((c) => c.name === "Protein")!.id;
  const preWorkoutCatId = categoryResult.find((c) => c.name === "Pre-Workout")!.id;
  const vitaminsCatId = categoryResult.find((c) => c.name === "Vitamins")!.id;
  const accessoriesCatId = categoryResult.find((c) => c.name === "Accessories")!.id;

  await createProductsWorkflow(container).run({
    input: {
      products: [
        // ── Protein ──────────────────────────────────────────────────
        {
          title: "MorphFit Whey Protein",
          category_ids: [proteinCatId],
          description:
            "Premium whey protein isolate with 25g of protein per serving. Supports muscle growth and recovery. Available in Chocolate and Vanilla flavors.",
          handle: "whey-protein",
          weight: 1000,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800" },
          ],
          options: [
            { title: "Flavor", values: ["Chocolate", "Vanilla", "Strawberry"] },
            { title: "Size", values: ["2 lbs", "5 lbs"] },
          ],
          variants: [
            {
              title: "Chocolate / 2 lbs",
              sku: "WHEY-CHOC-2LB",
              options: { Flavor: "Chocolate", Size: "2 lbs" },
              prices: [{ amount: 3999, currency_code: "usd" }, { amount: 3699, currency_code: "eur" }],
            },
            {
              title: "Chocolate / 5 lbs",
              sku: "WHEY-CHOC-5LB",
              options: { Flavor: "Chocolate", Size: "5 lbs" },
              prices: [{ amount: 7999, currency_code: "usd" }, { amount: 7299, currency_code: "eur" }],
            },
            {
              title: "Vanilla / 2 lbs",
              sku: "WHEY-VAN-2LB",
              options: { Flavor: "Vanilla", Size: "2 lbs" },
              prices: [{ amount: 3999, currency_code: "usd" }, { amount: 3699, currency_code: "eur" }],
            },
            {
              title: "Vanilla / 5 lbs",
              sku: "WHEY-VAN-5LB",
              options: { Flavor: "Vanilla", Size: "5 lbs" },
              prices: [{ amount: 7999, currency_code: "usd" }, { amount: 7299, currency_code: "eur" }],
            },
            {
              title: "Strawberry / 2 lbs",
              sku: "WHEY-STRAW-2LB",
              options: { Flavor: "Strawberry", Size: "2 lbs" },
              prices: [{ amount: 3999, currency_code: "usd" }, { amount: 3699, currency_code: "eur" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "MorphFit Casein Protein",
          category_ids: [proteinCatId],
          description:
            "Slow-digesting micellar casein protein for overnight recovery. 24g of protein per serving. Perfect as a nighttime shake.",
          handle: "casein-protein",
          weight: 1000,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6?w=800" },
          ],
          options: [
            { title: "Flavor", values: ["Chocolate", "Vanilla"] },
          ],
          variants: [
            {
              title: "Chocolate",
              sku: "CASEIN-CHOC-2LB",
              options: { Flavor: "Chocolate" },
              prices: [{ amount: 4499, currency_code: "usd" }, { amount: 4099, currency_code: "eur" }],
            },
            {
              title: "Vanilla",
              sku: "CASEIN-VAN-2LB",
              options: { Flavor: "Vanilla" },
              prices: [{ amount: 4499, currency_code: "usd" }, { amount: 4099, currency_code: "eur" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "MorphFit Plant Protein",
          category_ids: [proteinCatId],
          description:
            "100% plant-based protein blend from pea and brown rice. 22g of protein per serving, fully vegan and dairy-free.",
          handle: "plant-protein",
          weight: 900,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=800" },
          ],
          options: [
            { title: "Flavor", values: ["Chocolate", "Vanilla", "Unflavored"] },
          ],
          variants: [
            {
              title: "Chocolate",
              sku: "PLANT-CHOC-2LB",
              options: { Flavor: "Chocolate" },
              prices: [{ amount: 4299, currency_code: "usd" }, { amount: 3899, currency_code: "eur" }],
            },
            {
              title: "Vanilla",
              sku: "PLANT-VAN-2LB",
              options: { Flavor: "Vanilla" },
              prices: [{ amount: 4299, currency_code: "usd" }, { amount: 3899, currency_code: "eur" }],
            },
            {
              title: "Unflavored",
              sku: "PLANT-UNFL-2LB",
              options: { Flavor: "Unflavored" },
              prices: [{ amount: 3999, currency_code: "usd" }, { amount: 3599, currency_code: "eur" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        // ── Pre-Workout ───────────────────────────────────────────────
        {
          title: "MorphFit Pre-Workout Ignite",
          category_ids: [preWorkoutCatId],
          description:
            "High-stimulant pre-workout with 300mg caffeine, beta-alanine, and L-citrulline. Maximum energy, focus, and pump for intense training sessions.",
          handle: "pre-workout-ignite",
          weight: 350,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800" },
          ],
          options: [
            { title: "Flavor", values: ["Blue Raspberry", "Watermelon", "Fruit Punch"] },
          ],
          variants: [
            {
              title: "Blue Raspberry",
              sku: "PRE-IGNITE-BLURAZ",
              options: { Flavor: "Blue Raspberry" },
              prices: [{ amount: 4999, currency_code: "usd" }, { amount: 4499, currency_code: "eur" }],
            },
            {
              title: "Watermelon",
              sku: "PRE-IGNITE-WM",
              options: { Flavor: "Watermelon" },
              prices: [{ amount: 4999, currency_code: "usd" }, { amount: 4499, currency_code: "eur" }],
            },
            {
              title: "Fruit Punch",
              sku: "PRE-IGNITE-FP",
              options: { Flavor: "Fruit Punch" },
              prices: [{ amount: 4999, currency_code: "usd" }, { amount: 4499, currency_code: "eur" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "MorphFit Pre-Workout Stim-Free",
          category_ids: [preWorkoutCatId],
          description:
            "Stimulant-free pre-workout with citrulline malate, beta-alanine, and betaine. Perfect for evening training or those sensitive to caffeine.",
          handle: "pre-workout-stim-free",
          weight: 300,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800" },
          ],
          options: [
            { title: "Flavor", values: ["Lemon Lime", "Grape"] },
          ],
          variants: [
            {
              title: "Lemon Lime",
              sku: "PRE-SF-LL",
              options: { Flavor: "Lemon Lime" },
              prices: [{ amount: 3999, currency_code: "usd" }, { amount: 3599, currency_code: "eur" }],
            },
            {
              title: "Grape",
              sku: "PRE-SF-GRP",
              options: { Flavor: "Grape" },
              prices: [{ amount: 3999, currency_code: "usd" }, { amount: 3599, currency_code: "eur" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        // ── Vitamins ──────────────────────────────────────────────────
        {
          title: "MorphFit Multivitamin",
          category_ids: [vitaminsCatId],
          description:
            "Complete daily multivitamin with 25+ essential vitamins and minerals. Formulated specifically for active athletes and gym-goers.",
          handle: "multivitamin",
          weight: 200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://images.unsplash.com/photo-1550572017-edd951aa8ca4?w=800" },
          ],
          options: [
            { title: "Count", values: ["90 Capsules", "180 Capsules"] },
          ],
          variants: [
            {
              title: "90 Capsules",
              sku: "MULTI-90",
              options: { Count: "90 Capsules" },
              prices: [{ amount: 2499, currency_code: "usd" }, { amount: 2199, currency_code: "eur" }],
            },
            {
              title: "180 Capsules",
              sku: "MULTI-180",
              options: { Count: "180 Capsules" },
              prices: [{ amount: 3999, currency_code: "usd" }, { amount: 3599, currency_code: "eur" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "MorphFit Omega-3 Fish Oil",
          category_ids: [vitaminsCatId],
          description:
            "High-potency omega-3 fish oil with 1000mg EPA+DHA per serving. Supports heart health, joint recovery, and inflammation reduction.",
          handle: "omega-3",
          weight: 150,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800" },
          ],
          options: [
            { title: "Count", values: ["90 Softgels", "180 Softgels"] },
          ],
          variants: [
            {
              title: "90 Softgels",
              sku: "OMEGA3-90",
              options: { Count: "90 Softgels" },
              prices: [{ amount: 1999, currency_code: "usd" }, { amount: 1799, currency_code: "eur" }],
            },
            {
              title: "180 Softgels",
              sku: "OMEGA3-180",
              options: { Count: "180 Softgels" },
              prices: [{ amount: 3499, currency_code: "usd" }, { amount: 3199, currency_code: "eur" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "MorphFit Vitamin D3 + K2",
          category_ids: [vitaminsCatId],
          description:
            "5000 IU Vitamin D3 paired with 100mcg Vitamin K2 for optimal absorption. Supports bone health, immune function, and testosterone levels.",
          handle: "vitamin-d3-k2",
          weight: 100,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800" },
          ],
          options: [
            { title: "Count", values: ["60 Capsules"] },
          ],
          variants: [
            {
              title: "60 Capsules",
              sku: "VITD3K2-60",
              options: { Count: "60 Capsules" },
              prices: [{ amount: 1799, currency_code: "usd" }, { amount: 1599, currency_code: "eur" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        // ── Accessories ───────────────────────────────────────────────
        {
          title: "MorphFit Shaker Bottle",
          category_ids: [accessoriesCatId],
          description:
            "BPA-free 28oz shaker bottle with leak-proof lid and stainless steel mixing ball. Dishwasher safe.",
          handle: "shaker-bottle",
          weight: 300,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800" },
          ],
          options: [
            { title: "Color", values: ["Black", "White", "Orange"] },
          ],
          variants: [
            {
              title: "Black",
              sku: "SHAKER-BLK",
              options: { Color: "Black" },
              prices: [{ amount: 1499, currency_code: "usd" }, { amount: 1299, currency_code: "eur" }],
            },
            {
              title: "White",
              sku: "SHAKER-WHT",
              options: { Color: "White" },
              prices: [{ amount: 1499, currency_code: "usd" }, { amount: 1299, currency_code: "eur" }],
            },
            {
              title: "Orange",
              sku: "SHAKER-ORG",
              options: { Color: "Orange" },
              prices: [{ amount: 1499, currency_code: "usd" }, { amount: 1299, currency_code: "eur" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
      ],
    },
  });
  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    const inventoryLevel = {
      location_id: stockLocation.id,
      stocked_quantity: 1000000,
      inventory_item_id: inventoryItem.id,
    };
    inventoryLevels.push(inventoryLevel);
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("Finished seeding inventory levels data.");
}
