import { useState, useRef, useContext, useEffect } from 'react';
import {
  Flex,
  Text,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Heading,
  VStack,
  Textarea,
  Select,
  Image,
  Center,
  Button,
  useToast,
} from '@chakra-ui/react';
import { AiFillPicture } from 'react-icons/ai';
import { utils } from 'ethers';
import axios from 'axios';
import { useRouter } from 'next/router';

export const CreateNFTBody = () => {
  const router = useRouter();
  const { query } = router;
  const { collectionAddress } = query;

  const { mint } = useContext(Web3Context);

  const [file, setFile] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [metaData, setMetaData] = useState({
    name: '',
    description: '',
    royalty: '',
  });

  const handleInputChange = (field, value) => {
    const newMetaData = { ...metaData };
    newMetaData[field] = value;
    setMetaData(newMetaData);
  };

  const inputFileRef = useRef(null);

  const [previewImage, setPreviewImage] = useState('');

  const onCreate = async () => {
    if (!metaData.name || !metaData.description || !metaData.royalty) {
      toast({
        status: 'error',
        description: 'Please fill in all the required fields.',
      });
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Pin file to pinata
      const pinFileResponse = await axios.post('/api/pinata/pinFile', formData);
      toast({
        description: `File uploaded, Image Hash: ${pinFileResponse.data.IpfsHash}. Uploading metadata...`,
        status: 'success',
      });

      // Pin metadata to pinata
      const pinJSONResponse = await axios.post('/api/pinata/pinJSON', {
        ...metaData,
        image: pinFileResponse.data.IpfsHash,
      });
      toast({
        description: `Metadata uploaded ${pinJSONResponse.data.IpfsHash}. Please complete the transaction.`,
        status: 'success',
      });

      // Complete NFT creation on blockchain
      const txn = await mint(
        pinJSONResponse.data.IpfsHash,
        metaData.royalty,
        collectionAddress
      );
      if (txn) {
        console.log(txn);
      } else {
        await axios.patch('/api/pinata/unPin', {
          hash: pinFileResponse.data.IpfsHash,
        });
        await axios.patch('/api/pinata/unPin', {
          hash: pinJSONResponse.data.IpfsHash,
        });
        toast({
          description: `Transaction failed, NFT unpinned from IPFS.`,
          status: 'error',
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <Flex justifyContent='center' width='100vw'>
      <VStack alignItems='flex-start' spacing='8' my='16'>
        <Heading>Create New NFT</Heading>
        <FormControl isRequired>
          <FormLabel htmlFor='image'>
            Image, Video, Audio, or 3D Model
          </FormLabel>
          <Flex
            border={previewImage ? 'none' : 'dotted'}
            borderColor='gray.300'
            width='300px'
            height='200px'
            onClick={() => inputFileRef.current.click()}
            cursor='pointer'
            _hover={{
              bgColor: 'gray.100',
            }}
          >
            {previewImage ? (
              <Image
                src={previewImage}
                width='300px'
                height='200px'
                objectPosition='center'
                objectFit='contain'
                borderRadius='lg'
                alt='Banner image'
              />
            ) : (
              <Center flex={1}>
                <AiFillPicture fontSize='60px' color='gray' />
              </Center>
            )}
            <input
              id='image'
              type='file'
              accept='image/*'
              style={{ display: 'none' }}
              ref={inputFileRef}
              onChange={(e) => {
                const selectedImage = e.target.files[0];
                if (selectedImage) {
                  handleInputChange('file', selectedImage);
                  setPreviewImage(URL.createObjectURL(selectedImage));
                  setFile(selectedImage);
                }
              }}
            />
          </Flex>
          <FormHelperText>
            File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG,
            GLB, GLTF. Max size: 100 MB
          </FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor='name'>Name</FormLabel>
          <Input
            id='name'
            type='text'
            placeholder='Enter a name'
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
          <FormHelperText>
            Example: The Wonderful Polar Exploration.
          </FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <FormLabel htmlFor='royalty'>Royalty</FormLabel>
          <Input
            id='royalty'
            type='text'
            placeholder='Enter royalty amount'
            onChange={(e) => handleInputChange('royalty', e.target.value)}
          />
          <FormHelperText>Max 20%</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor='description'>Description</FormLabel>
          <Textarea
            id='description'
            placeholder='Provide a detailed description of your item'
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
          <FormHelperText>
            The description will be included underneath its image.
          </FormHelperText>
        </FormControl>

        <Button
          variant='solid'
          size='lg'
          onClick={onCreate}
          isLoading={isLoading}
          colorScheme='messenger'
        >
          Create
        </Button>
      </VStack>
    </Flex>
  );
};
