import { Flex, Text, Heading, SimpleGrid } from '@chakra-ui/react';

import { CollectionCard } from './CollectionCard';

export const ExploreCollectionsBody = () => {
  return (
    <Flex flexDir='column' mx='8' my='8' alignItems='center'>
      <Heading>Explore Collections</Heading>
      <SimpleGrid columns={3} spacing={8} my='8'>
        <CollectionCard />
        <CollectionCard />
        <CollectionCard />
      </SimpleGrid>
    </Flex>
  );
};
