"use client";

import { sponsorsApi } from "@/app/utils/apiClient";
import BaseCard from "../base_card";

type Sponsor = {
  category: string;
  alt: string;
  imageUrl?: string;
  name: string;
  targetUrl: string;
  id?: string;
};
export default function ViewSponsorClient({
  sponsors,
}: {
  sponsors: Sponsor[];
}) {
  const handleDelete = async (sponsor: Sponsor) => {
    await sponsorsApi.delete(sponsor.id as string, sponsor.category);
    console.log(`Sponsor ${sponsor.id} of ${sponsor.category} deleted`);
  };
  return (
    <div className="flex flex-wrap justify-center items-center">
      {sponsors.map((sponsor, i) => {
        const dataArray: { label: string; value: string; isUrl?: boolean }[] =
          [];
        dataArray.push({ label: "category", value: sponsor.category });
        dataArray.push({ label: "alt", value: sponsor.alt });
        dataArray.push({
          label: "imageUrl",
          value: sponsor.imageUrl as string,
          isUrl: true,
        });
        dataArray.push({ label: "name", value: sponsor.name });
        dataArray.push({ label: "id", value: sponsor.id as string });
        dataArray.push({ label: "targetUrl", value: sponsor.targetUrl });
        return (
          <div key={i} className="m-4">
            <BaseCard
              data={dataArray}
              title={sponsor.name}
              image={sponsor.imageUrl as string}
              toEdit={`sponsors/${sponsor.category}/${sponsor.id}`}
              onDelete={() => handleDelete(sponsor)}
            />
          </div>
        );
      })}
    </div>
  );
}
