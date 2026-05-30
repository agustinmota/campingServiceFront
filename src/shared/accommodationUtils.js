export function mapPublicCabins(cabins = []) {
  return cabins.map((item) => ({
    ...item,
    type: "cabin",
    typeLabel: "Cabin",
    price: item.pricePerDay,
    priceLabel: "per day"
  }));
}

export function mapPublicCampsites(campsites = []) {
  return campsites.map((item) => ({
    ...item,
    type: "campsite",
    typeLabel: "Campsite",
    price: item.pricePerPerson,
    priceLabel: "per person"
  }));
}

export function buildPublicAccommodations({ cabins = [], campsites = [] }) {
  return [...mapPublicCabins(cabins), ...mapPublicCampsites(campsites)];
}

export function buildAdminAccommodations(cabins = [], campsites = []) {
  return [
    ...cabins.map((item) => ({ ...item, type: "Cabin", price: item.pricePerDay, rateLabel: "per day" })),
    ...campsites.map((item) => ({ ...item, type: "Campsite", price: item.pricePerPerson, rateLabel: "per person" }))
  ];
}
