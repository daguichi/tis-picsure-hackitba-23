import { useState } from "react";
import ImageCard from "../components/ImageCard";

const Home = () => {

  const [images, setImages] = useState([]);

  return (
    <div>
      <h1>Home</h1>
      <ImageCard/>
    </div>
  );
}

export default Home;