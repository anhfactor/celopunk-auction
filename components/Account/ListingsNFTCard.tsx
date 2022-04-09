import { useEffect, useContext, useState } from 'react';
import { Flex, Text, Button, useDisclosure, VStack } from '@chakra-ui/react';
import { getJSONfromHash, imageSourceBaseURL } from '@config/axios';

import AppContext from '@components/AppContext';
import { MotionChakraImage } from '@components/Animated/MotionChakraImage';
import { formatDate } from '../../utils/helpfulFunctions';

export const ListingsNFTCard = ({ nft }) => {
  const { account } = useContext(AppContext);

  const { name, description, image, category, dateCreated } = nft;
  return (
    <Flex
      borderRadius='lg'
      flexDir='column'
      shadow='lg'
      alignItems='left'
      className='animate-on-hover'
    >
      <Flex overflow='hidden' height='100%' borderTopRadius='lg'>
        <MotionChakraImage src={`https://ipfs.infura.io/ipfs/${image}`} alt='nft' />
      </Flex>
      <VStack spacing='4' my='4'>
        <Text fontWeight='bold' fontSize='lg'>
          {name}
        </Text>
        <Text fontWeight='thin' textAlign='left'>
          {description}
        </Text>
        <Text fontWeight='thin' textAlign='left'>
          category: {category}
        </Text>
        <Text fontWeight='thin' textAlign='left'>
        Created {formatDate(dateCreated)} ago
        </Text>
      </VStack>
    </Flex>
  );
};
