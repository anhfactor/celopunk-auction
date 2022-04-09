import { useState } from 'react';
import {
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  Select,
  Input,
} from '@chakra-ui/react';

export const ListForSaleModal = ({
  isOpen,
  onClose,
  contractAddress,
  tokenId,
  createMarketItem,
  createMarketAuction,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [saleType, setSaleType] = useState('fixed');
  const [salesPrice, setSalesPrice] = useState('');
  const [initialBid, setInitialBid] = useState('');
  const [numOfDays, setNumOfDays] = useState('');

  const renderInputs = () => {
    if (saleType === 'fixed') {
      return (
        <>
          <Text fontWeight='medium' fontSize='lg'>
            Sales Price
          </Text>
          <Input
            placeholder='10 ETH'
            onChange={(e) => setSalesPrice(e.target.value)}
          />
        </>
      );
    }
    if (saleType === 'auction') {
      return (
        <>
          <Text fontWeight='medium' fontSize='lg'>
            Initial Bid
          </Text>
          <Input
            placeholder='1 ETH'
            onChange={(e) => setInitialBid(e.target.value)}
          />
          <Text fontWeight='medium' fontSize='lg'>
            Number of Days
          </Text>
          <Input
            placeholder='3 days'
            onChange={(e) => setNumOfDays(e.target.value)}
          />
        </>
      );
    }
  };

  const listForSale = async () => {
    setIsLoading(true);
    if (saleType === 'fixed') {
      const response = await createMarketItem(
        contractAddress,
        tokenId,
        salesPrice
      );
      console.log(response);
      setIsLoading(false);
    } else if (saleType === 'auction') {
      const response = await createMarketAuction(
        contractAddress,
        tokenId,
        initialBid,
        numOfDays
      );
      console.log(response);
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>List For Sale</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack alignItems='flex-start'>
            <Text fontWeight='medium' fontSize='lg'>
              Sales Type
            </Text>
            <Select
              onChange={(e) => setSaleType(e.target.value)}
              value={saleType}
            >
              <option value='fixed'>Fixed Price</option>
              <option value='auction'>Auction</option>
            </Select>
            {renderInputs()}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant='solid'
            colorScheme='messenger'
            onClick={listForSale}
            isLoading={isLoading}
          >
            List NFT in Marketplace
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
