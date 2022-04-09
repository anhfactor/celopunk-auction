import { useState, useEffect, useContext } from 'react';
import {
  Flex,
  Text,
  Heading,
  VStack,
  HStack,
  Badge,
  SimpleGrid,
  Button,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { MdVerified } from 'react-icons/md';

import { MotionChakraImage } from '@components/Animated/MotionChakraImage';
import { NFTCard } from './NFTCard';
import { getJSONfromHash, imageSourceBaseURL } from '@config/axios';
import Web3Context from '@context/Web3Context';
import { EmptyContent } from '@components/EmptyContent';

export const CollectionDetailsBody = () => {
  const router = useRouter();
  const { query } = router;
  const { collectionAddress, hash } = query;

  console.log(collectionAddress, hash);

  const { account, balanceOf, tokenOfOwnerByIndex, tokenURI, withdraw } =
    useContext(Web3Context);

  const [metaData, setMetaData]: any = useState({});
  const [totalNFTs, setTotalNFTs] = useState(0);
  const [NFTDetails, setNFTDetails] = useState([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      const response = await balanceOf(account, collectionAddress);
      if (response) {
        const parsedResponse = parseInt(response.toString());
        setTotalNFTs(parsedResponse);
      }
    };

    if (collectionAddress) {
      fetchNFTs();
    }
  }, [collectionAddress, account, balanceOf]);

  useEffect(() => {
    const fetchMetaData = async () => {
      const { data } = await getJSONfromHash(hash);
      setMetaData(data);
    };

    if (hash) {
      fetchMetaData();
    }
  }, [hash]);

  useEffect(() => {
    const fetchNFTData = async () => {
      if (totalNFTs < 0) {
        return;
      }
      let nfts = [];
      for (var i = 0; i < totalNFTs; i++) {
        const result = await tokenOfOwnerByIndex(account, i, collectionAddress);
        let tokenId;
        if (result) {
          const resultString = result.toString();
          tokenId = parseInt(resultString);
        }
        const nftData = {
          ownerAddress: account,
          contractAddress: collectionAddress,
          tokenId: tokenId,
          tokenURI: '',
        };
        nftData['tokenURI'] = await tokenURI(
          nftData.tokenId,
          collectionAddress
        );
        const { data } = await getJSONfromHash(nftData.tokenURI);
        nftData['metaData'] = data;
        nfts.push(nftData);
      }
      setNFTDetails(nfts);
      console.log(nfts);
    };

    if (totalNFTs > 0) {
      fetchNFTData();
    }
  }, [totalNFTs, collectionAddress, account, tokenOfOwnerByIndex, tokenURI]);
  console.log(totalNFTs);
  console.log(NFTDetails);

  const { name, symbol, title, category, description, image } = metaData;

  const onWithdraw = async () => {
    const result = await withdraw(collectionAddress);
    console.log(result);
  };

  const renderNFTs = () => {
    if (totalNFTs === 0) {
      return <EmptyContent />;
    } else {
      return (
        <SimpleGrid columns={6} spacing='8' mx='16'>
          {NFTDetails.map((nft) => {
            return <NFTCard key={nft.tokenURI} nft={nft} />;
          })}
        </SimpleGrid>
      );
    }
  };

  return (
    <Flex flexDir='column' alignItems='center' mx='auto'>
      <Flex
        height='200px'
        width='600px'
        overflow='hidden'
        alignItems='center'
        shadow='dark-lg'
        borderRadius='lg'
        objectFit='contain'
        mt='8'
      >
        <MotionChakraImage
          src={image && imageSourceBaseURL + image}
          alt='Collection logo'
        />
      </Flex>
      <VStack my='16' spacing='8' maxWidth='3xl'>
        <HStack>
          <Heading>{name}</Heading>

          <MdVerified />
          <Badge colorScheme='green' mt='2'>
            {category}
          </Badge>
        </HStack>
        <Text textAlign='center'>{description}</Text>
        <Button
          onClick={() =>
            router.push(`/explore-collections/${collectionAddress}/create-nft`)
          }
          variant='solid'
          colorScheme='messenger'
        >
          Create an NFT in this collection.
        </Button>
      </VStack>
      {renderNFTs()}
    </Flex>
  );
};
