import React from "react";
import src1 from '../img/group1.png';
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from 'react-image-gallery';

const images = [
    {
        original: src1
    },
    {
        original: src1
    }
];

export default () => (
    <ImageGallery items={images} showThumbnails={false} style={{width:'100%', height:'300px'}}/>
);
