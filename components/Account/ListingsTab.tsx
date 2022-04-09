import { useContext, useEffect, useState } from 'react';
import { Flex, Text, Center, Spinner, SimpleGrid } from '@chakra-ui/react';

import AppContext from '@components/AppContext';
import { ListingsNFTCard } from './ListingsNFTCard';

export const ListingsTab = () => {
  const { account, getOwnerNFT } = useContext(AppContext);
  const [itemsListed, setItemsListed] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const nfts = await getOwnerNFT();
      setItemsListed(nfts)
    };
    fetch();
  }, []);

  if (itemsListed.length === 0) {
    return (
      <Center h='100vh'>
        <Spinner />
      </Center>
    );
  }

  return (
    <Flex m='16'>
      <SimpleGrid columns={4} spacing='8'>
        {itemsListed.map((nft) => {
          if (nft.owner.toUpperCase() === account.toUpperCase())
            return <ListingsNFTCard key={nft.tokenId} nft={nft} />;
        })}
      </SimpleGrid>
    </Flex>
  );
};
