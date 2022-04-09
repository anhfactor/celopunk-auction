import { useEffect, useState } from 'react';
import { Flex, Text, Badge, HStack } from '@chakra-ui/react';
import { MdVerified } from 'react-icons/md';
import { useRouter } from 'next/router';

import { MotionChakraImage } from '@components/Animated/MotionChakraImage';
import { getJSONfromHash, imageSourceBaseURL } from '@config/axios';

export const CollectionCard = ({ collection = {} }) => {
  const router = useRouter();
  const [metaData, setMetaData]: any = useState({});
  const { contractAddress, metaDataHash }: any = collection;

  useEffect(() => {
    const fetchMetaData = async () => {
      if (!metaDataHash) return;
      const { data } = await getJSONfromHash(metaDataHash);
      setMetaData(data);
    };

    fetchMetaData();
  }, [metaDataHash]);

  const { name, symbol, title, category, description, image } = metaData;

  return (
    <Flex
      borderRadius='lg'
      flexDir='column'
      shadow='lg'
      alignItems='center'
      cursor='pointer'
      className='animate-on-hover'
      onClick={() => {
        router.push(
          `/explore-collections/${contractAddress}?hash=${metaDataHash}`
        );
      }}
    >
      <Flex
        overflow='hidden'
        justifyContent='center'
        alignItems='center'
        borderTopRadius='lg'
      >
        <MotionChakraImage
          src={image ? imageSourceBaseURL + image : '/celopunk_banner.png'}
          alt='Collection banner'
        />
      </Flex>

      <HStack alignItems='center' mt='8'>
        <Text fontWeight='medium' fontSize='lg'>
          {name}
        </Text>
        <MdVerified />
      </HStack>
      <Badge colorScheme='green' mt='2'>
        {category}
      </Badge>
      <Text m='8' textAlign='center' noOfLines={3} color='gray.500'>
        {description}
      </Text>
    </Flex>
  );
};
