export enum ProductSortKey {
  id = 'id',
  name = 'name',
  brand = 'brand',
  sku = 'sku',
  cbdMin = 'cbdMin',
  cbdMax = 'cbdMax',
  thcMin = 'thcMin',
  thcMax = 'thcMax',
  status = 'status',
  packSize = 'packSize',
  cannabis = 'cannabis',
  price = 'price',
  CreateAt = 'createdAt',
}

export enum ProductCategory {
  other = 'Other',
  concentrate = 'Concentrate',
  flower = 'Flower',
  ingestible = 'Ingestible',
  nonCannabis = 'Non-Cannabis',
  topical = 'Topical',
}

export enum ProductClass {
  other = 'Other',
  swag = 'Swag',
  accessories = 'Accessories',
  batteries = 'Batteries',
  capsules = 'Capsules',
  clones = 'Clones',
  dabbable = 'Dabbable Concentrates',
  driedFlower = 'Dried Flower',
  edibles = 'Edibles',
  lotionsAndTopical = 'Lotions & Topcial Oils',
  makeUp = 'Makeup',
  otherConcentrate = 'Other Concentrate',
  otherNonCannabis = 'Other Non-Cannabis',
  preroll = 'Preroll',
  seeds = 'Seeds',
  soaps = 'Soaps',
  sublinguals = 'Sublinguals',
  vapes = 'Vapes',
}

export enum ProductSubClass {
  xsoftgels = 'xSoftgels (DO NOT USE)',
  bags = 'Bags',
  clothing = 'Clothing',
  drinking = 'Drinking',
  miscellaneous = 'Miscellaneous',
  none = 'N/A',
  five = '510',
  batteryPack = '510 Battery Pack',
  beverages = 'Beverages',
  bongs = 'Bongs',
  bottledCrumble = 'Bottled Crumble',
  bottledDecarbed = 'Bottled Decarbed',
  bottledFlower = 'Bottled Flower',
  bottledMilled = 'Bottled Milled',
  bottledTrim = 'Bottled Trim',
  budder = 'Budder',
  bulkFlower = 'Bulk Flower',
  chocolates = 'Chocolates',
  cookies = 'Cookies',
  disposable = 'Disposable',
  grinder = 'Grinder',
  growingEquipment = 'Growing Equipment',
  gummies = 'Gummies',
  hardCaps = 'Hard caps',
  hash = 'Hash',
  isolates = 'Isolates',
  kits = 'Kits',
  lighters = 'Lighters',
  lipBalms = 'Lip Balms',
  liveResin = 'Live Resin',
  lotionsAndTopical = 'Lotions & Topical Oils',
  mints = 'Mints',
  oils = 'Oils',
  other = 'Other',
  papers = 'Papers',
  paxCartridge = 'Pax Cartridge',
  pipes = 'Pipes',
  preroll = 'Preroll',
  proteinProducts = 'Protein Products',
  rosin = 'Rosin',
  shatter = 'Shatter',
  soaps = 'Soaps',
  softgels = 'Softgels',
  sprays = 'Sprays',
  storage = 'Storage',
  strips = 'Strips',
  trays = 'Trays',
  vaporizers = 'Vaporizers',
  wax = 'Wax',
}

export enum ProductType {
  none = 'None',
  indica = 'Indica',
  sativa = 'Sativa',
  hybrid = 'Hybrid',
}

export enum ProductPackSizeUOM {
  ea = 'ea',
  g = 'g',
  kg = 'kg',
  caps = 'caps',
  ml = 'ml',
}

export enum vacCoverage {
  full = 'Full',
  partial = 'Partial',
  none = 'None',
}

export enum ProductStatus {
  active = 'Active',
  inactive = 'Inactive',
}

export enum ProductStatusReason {
  draft = 'Draft',
  active = 'Active',
  rundown = 'Rundown',
  retired = 'Retired',
}

export enum PotencyUnitOfMeasure {
  mgml = 'mg/ml',
  mgea = 'mg/ea',
  mgcap = 'mg/cap',
  ww = '% w/W',
  mgg = 'mg/g',
}

export enum PotencyRank {
  balanced = 'Balanced',
  none = 'None',
  low = 'Low',
  med = 'Med',
  medHigh = 'Med-High',
  high = 'High',
}
