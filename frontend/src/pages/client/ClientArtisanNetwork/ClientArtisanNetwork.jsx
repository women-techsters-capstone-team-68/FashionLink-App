import ArtisanNetwork from "../../artisan/ArtisanNetwork/ArtisanNetwork.jsx";

export default function ClientArtisanNetwork() {
  return (
    <div className="al__content">
      {/* This prop ensures you don't see yourself in the list */}
      <ArtisanNetwork hideOwnProfile={true} />
    </div>
  );
}