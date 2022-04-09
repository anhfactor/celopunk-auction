import { Flex, Text } from '@chakra-ui/react';

import { IoIosHeartEmpty } from 'react-icons/io';

export const EmptyContent = () => {
  return (
    <Flex flexDir='column'>
      <Text color='gray.300'>There is nothing to display.</Text>
    </Flex>
  );
};
