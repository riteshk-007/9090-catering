/**
 * Every static photograph used on the marketing pages lives here, so images are easy to find and swap.
 * (The Gallery page itself is managed from the admin panel and stored in Cloudflare R2.)
 */

export const LOGO =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-OnrMaUtsp8ypPAA4jFpYnkQYb05ThN.png'

const unsplash = (id: string, width = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=85`

/** Photos used on the home page. */
export const photos = {
  hero: unsplash('1414235077428-338989a2e8c0', 2400),
  chef: unsplash('1577303935007-0d306ee638cf', 1200),
  menuMain: unsplash('1476224203421-9ac39bcb3327'),
  menuSmall: unsplash('1543353071-873f17a7a088', 900),
  celebrations: unsplash('1519225421980-715cb0215aed'),
  corporate: unsplash('1559339352-11d035aa65de', 1200),
  private: unsplash('1529543544282-ea669407fca3', 1400),
  banner: unsplash('1519167758481-83f550bb49b3', 2400),
  cta: unsplash('1600891964092-4316c288032e', 2000),
  gallery: {
    a: unsplash('1504674900247-0877df9cc836', 1200),
    b: unsplash('1555244162-803834f70033', 1200),
    c: unsplash('1551024506-0bccd828d307', 1200),
    d: unsplash('1498837167922-ddd27525d352', 1200),
    e: unsplash('1565958011703-44f9829ba187', 1200),
  },
}

/** Additional photos used on the inner pages. */
export const more = {
  kitchen: unsplash('1556910103-1c02745aae4d'),
  chefKitchen: unsplash('1466978913421-dad2ebd01d17'),
  restaurant: unsplash('1555396273-367ea4eb4db5'),
  interior: unsplash('1517248135467-4c7edcad34c4'),
  diners: unsplash('1528605248644-14dd04022da1'),
  spread: unsplash('1504754524776-8f4f37790ca0'),
  platter: unsplash('1493770348161-369560ae357d'),
  pasta: unsplash('1473093295043-cdd812d0e601'),
  salad: unsplash('1540189549336-e6e99c3679fe'),
  fruit: unsplash('1482049016688-2d3e1b311543'),
  grill: unsplash('1555939594-58d7cb561ad1'),
  wedding: unsplash('1464366400600-7168b8af9bc3'),
  weddingTable: unsplash('1511795409834-ef04bbd61622'),
  party: unsplash('1478146896981-b80fe463b330'),
  meeting: unsplash('1556761175-5973dc0f32e7'),
  conference: unsplash('1517457373958-b7bdd4587205'),
  dinnerGroup: unsplash('1543007630-9710e4a00a20'),
  drinks: unsplash('1470337458703-46ad1756a187'),
  food1: unsplash('1484980972926-edee96e0960d'),
  food2: unsplash('1467003909585-2f8a72700288'),
  food3: unsplash('1424847651672-bf20a4b0982b'),
  breakfast: unsplash('1567620905732-2d1ec7ab7445'),
  pizza: unsplash('1565299624946-b28f40a0ae38'),
}
