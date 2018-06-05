import React from "react";
import src1 from '../img/group1.png';
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from 'react-image-gallery';

const images = [
    {
        original: src1,
        thumbnail: src1,
    },
    {
        original: src1,
        thumbnail: src1,
    },
    {
        original: 'http://lorempixel.com/1000/600/nature/3/',
        thumbnail: 'http://lorempixel.com/250/150/nature/3/'
    }
];

export default () => (
    <ImageGallery items={images} style={{width:'100%', height:'300px'}}/>
);
