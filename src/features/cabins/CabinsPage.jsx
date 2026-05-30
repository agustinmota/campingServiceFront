import { ResourcePage } from "../../shared/ResourcePage";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../auth/authSlice";
import { formatCurrency } from "../../shared/currencyUtils";

export function CabinsPage() {
  const user = useSelector(selectAuthUser);

  return (
    <ResourcePage
      resource="cabins"
      title="Cabins"
      description="Accommodation management with daily pricing."
      emptyText="No cabins have been added."
      columns={[
        {
          key: "imageUrl",
          label: "Photo",
          render: (item) => (
            <img className="resource-thumb" src={item.imageUrl} alt={`Cabin ${item.identifier}`} />
          )
        },
        { key: "identifier", label: "Identifier" },
        { key: "description", label: "Description" },
        { key: "maxCapacity", label: "Capacity" },
        { key: "pricePerDay", label: "Price/day", render: (item) => formatCurrency(item.pricePerDay) }
      ]}
      fields={[
        { name: "identifier", label: "Identifier" },
        { name: "description", label: "Description" },
        { name: "maxCapacity", label: "Maximum capacity", type: "number", min: 1 },
        { name: "pricePerDay", label: "Price per day (USD)", type: "number", min: 0 },
        { name: "imageUrl", label: "Photo", type: "file", accept: "image/*" }
      ]}
      canManage={user?.role === "admin"}
      getItemHref={(item) => `/app/reserve/cabin/${item.id}`}
    />
  );
}
