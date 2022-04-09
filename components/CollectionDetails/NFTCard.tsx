import { useState, useContext, useEffect } from 'react';
import { Flex, Text, Button, VStack, useDisclosure } from '@chakra-ui/react';

import { MotionChakraImage } from '@components/Animated/MotionChakraImage';
import { imageSourceBaseURL } from '@config/axios';

import Web3Context from '@context/Web3Context';
import { ListForSaleModal } from './ListForSaleModal';

export const NFTCard = ({ nft }) => {
  const {
    account,
    createMarketItem,
    setApprovalForAll,
    isApprovedForAll,
    createMarketAuction,
  } = useContext(Web3Context);

  const [isLoading, setIsLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { metaData, contractAddress, ownerAddress, tokenURI, tokenId } = nft;
  const { name, description, image, royalty } = metaData;

  useEffect(() => {
    const checkApproval = async () => {
      setIsApproved(await isApprovedForAll(ownerAddress, contractAddress));
    };

    if (contractAddress) {
      checkApproval();
    }
  }, [contractAddress]);

  const renderListForSale = () => {
    const onApprove = async () => {
      setIsLoading(true);
      const result = await setApprovalForAll(true, contractAddress);
      setIsApproved(result);
      setIsLoading(false);
    };

    if (!isApproved) {
      return (
        <Button onClick={onApprove} isLoading={isLoading} variant='solid'>
          Approve
        </Button>
      );
    } else {
      return (
        <>
          <ListForSaleModal
            isOpen={isOpen}
            onClose={onClose}
            createMarketItem={createMarketItem}
            tokenId={tokenId}
            contractAddress={contractAddress}
            createMarketAuction={createMarketAuction}
          />
          <Button
            onClick={onOpen}
            variant='solid'
            colorScheme='messenger'
            isLoading={isLoading}
          >
            List for Sale
          </Button>
        </>
      );
    }
  };

  return (
    <Flex
      borderRadius='lg'
      flexDir='column'
      shadow='lg'
      alignItems='center'
      className='animate-on-hover'
    >
      <Flex overflow='hidden' borderTopRadius='lg'>
        <MotionChakraImage src={imageSourceBaseURL + image} alt='nft' />
      </Flex>
      <VStack spacing='4' m='4'>
        <Text fontWeight='bold' fontSize='lg'>
          {name}
        </Text>
        <Text fontWeight='thin' textAlign='center' noOfLines={2}>
          {description}
        </Text>
        {renderListForSale()}
      </VStack>
    </Flex>
  );
};
