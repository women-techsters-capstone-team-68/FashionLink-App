import ArtisanContact from "../../artisan/ArtisanContact/ArtisanContact.jsx";
import { useParams } from "react-router-dom";

export default function ClientArtisanContact() {
  const { id } = useParams();
  return (
    <div className="al__content">
      <ArtisanContact id={id} />
    </div>
  );
}