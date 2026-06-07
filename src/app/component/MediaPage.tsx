import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import MediaCenter from "@/components/media/MediaCenter";

/** Legacy wrapper — prefer /media route directly */
const MediaPage: React.FC = () => (
  <>
    <NavBar />
    <MediaCenter />
    <Footer />
  </>
);

export default MediaPage;
