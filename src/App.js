import './App.css';
import React, { useState, useEffect } from 'react';

import { storage } from './firebase'
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage'
import { v4 } from 'uuid'

function App() {

  const [selectedImage, setSelectedImage] = useState('')
  const [imageUrls, setImageUrls] = useState([])
  // console.log(`imageUrls`, imageUrls);

  const collectionImage = ref(storage, 'images/')

  const handleChange = (e) => {
    e.preventDefault()
    setSelectedImage(e.target.files[0])
  }

  const handleSubmit = () => {

    if (!selectedImage) return

    const imageRef = ref(storage, `images/${selectedImage.name + v4()}`)
    uploadBytes(imageRef, selectedImage)
      .then((snapshot) => {
        console.log('upload succesfully');

        getDownloadURL(snapshot.ref).then((url) => {
          setImageUrls((prev) => [...prev, url]);
        });
      })
  }

  useEffect(() => {

    // note: เนื่องจากมันเป็น Promise จึงต้องรอให้มันดึงข้อมูลมาให้หมดก่อน,
    // โดยการใช่ async function, มันจะได้ไม่ต้องโหลดหน้าจอใหม่ขณะดึงข้อมูล
    // แล้วค่อย set state
    const getImages = async () => {
      await listAll(collectionImage).then((snapshot) => {
        snapshot.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            setImageUrls(prev => [...prev, url])
          })
        })
      })
    }

    // เรียกใช้งานฟั้งชันก์ พร้อมกับเคลียร์ effect
    return () => getImages()

  }, [])

  return (
    <div className="App">
      <input type="file" onChange={handleChange} />
      <button onClick={handleSubmit}> Upload Image</button>

      <hr />

      <div>
        {imageUrls.map((item, index) => {
          return <img key={index} src={item} alt="image" />
        })}
      </div>

    </div>
  );
}

export default App;
