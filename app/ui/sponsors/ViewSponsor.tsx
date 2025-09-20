import ViewSponsorClient from "./ViewSponsorClient";

// Using the API route directly from server component
export default async function ViewSponsor() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/sponsors`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch sponsors');
  }
  
  const sponsors = await response.json();
  return <ViewSponsorClient sponsors={sponsors} />;
}
