import './App.css';
import React, { useState, useEffect, useRef } from 'react';

import { storage } from './firebase'
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage'
import { v4 } from 'uuid'

// #Mantine
import { createStyles, Divider, Card, Group, Text, useMantineTheme, Button, Container, SimpleGrid, Image } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';

function App() {

  const [selectedImage, setSelectedImage] = useState('')
  const [imageUrls, setImageUrls] = useState([])
  console.log(`selecte image`, selectedImage);

  const openRef = useRef(null);
  const collectionImage = ref(storage, 'images/')
  const { classes } = useStyles()

  /**
   * It takes the selected image, creates a reference to the storage bucket, uploads the image to the
   * bucket, and then gets the download URL for the image
   * @returns const uploadImage = () => {
   *     if (!selectedImage) return
   */
  const uploadImage = () => {
    if (!selectedImage) return

    try {
      selectedImage.map(item => {
        const imageRef = ref(storage, `images/${item.name + v4()}`)
        uploadBytes(imageRef, item)
          .then((snapshot) => {
            console.log('upload succesfully');

            getDownloadURL(snapshot.ref).then((url) => {
              setImageUrls((prev) => [...prev, url]);
            });
          })
      })
    } catch (error) {
      console.log(error)
    } finally {
      setSelectedImage()
    }
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


  // Dropzone component
  const BaseDemo = (props) => {
    const theme = useMantineTheme();

    return (
      <div>
        <Dropzone
          onDrop={(files) => setSelectedImage(files.map(item => item))}
          onReject={(files) => alert(`${files[0].errors[0].message}`)}
          maxSize={3 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
          openRef={openRef}
          {...props}
        >
          <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <IconUpload
                size={50}
                stroke={1.5}
                color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                size={50}
                stroke={1.5}
                color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size={50} stroke={1.5} />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                {!selectedImage
                  ? 'Drag images here or click to select files'
                  : `${selectedImage.map(item => item.name)}`
                }
              </Text>
              <Text size="sm" color="dimmed" inline mt={7}>
                {!selectedImage
                  ? 'Attach as many files as you like, each file should not exceed 5mb'
                  : `Size : ${selectedImage.map(item => item.size)}`
                }
              </Text>
            </div>
          </Group>
        </Dropzone>
        <Group position="center" mt="md">
          {!selectedImage
            ? <Button onClick={() => openRef.current()}>Select files</Button>
            : <Button onClick={uploadImage}>Upload files</Button>
          }
        </Group>
      </div>
    );
  }

  return (
    <div style={{ margin: '2rem' }}>
      <div style={{
        display: ' flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '2rem 0'
      }}>
        <BaseDemo />
      </div>

      <Divider size={'sm'} my="xs" label="See Images below" labelPosition='left' />

      <Container py="xl">
        <SimpleGrid cols={3} spacing="md" verticalSpacing="md" breakpoints={[{ maxWidth: 'sm', cols: 2 }]}>
          {imageUrls.map((item, index) => {
            return (
              <Card className={classes.card}
                shadow="sm"
                p="xl"
                key={index}
              >
                <Card.Section>
                  <Image
                    src={item}
                    height={350}
                    alt="No way!"
                  />
                </Card.Section>

                <Text weight={500} size="md" mt="md">
                  {`Image #${index + 1}`}
                </Text>
              </Card>
            )
          })}
        </SimpleGrid>
      </Container>

    </div >
  );
}

export default App;

const useStyles = createStyles((theme) => ({
  card: {
    img: {
      transition: 'transform 150ms ease, box-shadow 150ms ease',

      '&:hover': {
        transform: 'scale(1.02)',
        // boxShadow: theme.shadows.md,
      },
    }
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 600,
  },
}));
