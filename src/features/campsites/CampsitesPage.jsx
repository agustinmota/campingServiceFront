import { ResourcePage } from "../../shared/ResourcePage";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../auth/authSlice";

export function CampsitesPage() {
  const user = useSelector(selectAuthUser);

  return (
    <ResourcePage
      resource="campsites"
      title="Campsites"
      description="Camping spaces with per-person pricing."
      emptyText="No campsites have been added."
      columns={[
        {
          key: "imageUrl",
          label: "Photo",
          render: (item) => (
            <img className="resource-thumb" src={item.imageUrl} alt={`Campsite ${item.identifier}`} />
          )
        },
        { key: "identifier", label: "Identifier" },
        { key: "description", label: "Description" },
        { key: "maxCapacity", label: "Capacity" },
        { key: "pricePerPerson", label: "Price/person", render: (item) => `$${item.pricePerPerson}` }
      ]}
      fields={[
        { name: "identifier", label: "Identifier" },
        { name: "description", label: "Description" },
        { name: "maxCapacity", label: "Maximum capacity", type: "number", min: 1 },
        { name: "pricePerPerson", label: "Price per person", type: "number", min: 0 },
        { name: "imageUrl", label: "Photo URL" }
      ]}
      canManage={user?.role === "admin"}
    />
  );
}
