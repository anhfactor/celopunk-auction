import { useContext, useState, useEffect } from 'react';
import { Flex, Text, Center, Spinner, SimpleGrid } from '@chakra-ui/react';

import AppContext from '@components/AppContext';
import { CollectedNFTCard } from './CollectedNFTCard';
import { EmptyContent } from '@components/EmptyContent';

export const CollectedNFTsTab = () => {
  const { account, getOwnerNFT } = useContext(AppContext);
  const [collectedNFTs, setCollectedNFTs] = useState([]);

  useEffect(() => {

    const fetch = async () => {
        const nfts = await getOwnerNFT();
        setCollectedNFTs(nfts)
    };
    fetch();
  }, [getOwnerNFT]);


  if (collectedNFTs.length === 0) {
    return (
      <Center h='100vh'>
        <EmptyContent />
        <Spinner />
      </Center>
    );
  }

  return (
    <Flex m='16'>
      <SimpleGrid columns={4} spacing='8'>
        {collectedNFTs.map((nft) => {
          if (nft.owner.toUpperCase() === account.toUpperCase() || nft.offer.user.toUpperCase() == account.toUpperCase())
            return <CollectedNFTCard key={nft.index} nft={nft} />;
        })}
      </SimpleGrid>
    </Flex>
  );
};
