import React, { useCallback, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useData, useTheme, useTranslation } from '../hooks/';
import { Block, Button, Text } from '../components/';
import Product from '../components/Product'; // Import your Product component

const Home = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<number>(0);
  const { liverate, commodities } = useData();
  const [products, setProducts] = useState(liverate);
  const { colors, fonts, sizes } = useTheme();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const [cardHeadings, setCardHeadings] = useState({
    heading1: 'Heading 1',
    heading2: 'Heading 2',
  });

  useEffect(() => {
    // Update the currentDateTime every second
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run the effect only once on mount

  const handleProducts = useCallback(
    (selectedTab: number) => {
      setTab(selectedTab);
      setProducts(selectedTab === 0 ? liverate : commodities);
    },
    [liverate, commodities, setTab, setProducts],
  );

  return (
    <Block>
      {/* Date & Time */}
      <Block color={colors.card} flex={0} padding={sizes.padding}>
        <Text
          p
          size={18}
          font={fonts?.[tab === 1 ? 'medium' : 'normal']}
          style={styles.boldCenterText}>
          {currentDateTime.toLocaleDateString()}
        </Text>
        <Text
          p
          size={36}
          paddingTop={20}
          weight="bold"
          style={styles.boldCenterText}>
          {currentDateTime.toLocaleTimeString()}
        </Text>
      </Block>

      {/* Toggle products list */}
      <Block
        row
        flex={0}
        align="center"
        justify="center"
        color={colors.card}
        paddingBottom={sizes.sm}>
        <Button onPress={() => handleProducts(0)}>
          <Block row align="center">
            <Text p font={fonts?.[tab === 0 ? 'medium' : 'normal']}>
              {t('home.liverate')}
            </Text>
          </Block>
        </Button>
        <Block
          gray
          flex={0}
          width={1}
          marginHorizontal={sizes.sm}
          height={sizes.socialIconSize}
        />
        <Button onPress={() => handleProducts(1)}>
          <Block row align="center">
            <Text p font={fonts?.[tab === 1 ? 'medium' : 'normal']}>
              {t('home.commodities')}
            </Text>
          </Block>
        </Button>
      </Block>

      {/* Products list */}
      <Block
        scroll
        paddingHorizontal={sizes.padding}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: sizes.l }}>
        <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
          {/* Render two editable cards if the liverate tab is selected */}
          {tab === 0 ? (
            <>
              <Product
                id={1}
                heading={cardHeadings.heading1}
                onHeadingChange={(newHeading) =>
                  handleHeadingChange(1, newHeading)
                }
              />
              <Product
                id={2}
                heading={cardHeadings.heading2}
                onHeadingChange={(newHeading) =>
                  handleHeadingChange(2, newHeading)
                }
              />
            </>
          ) : (
            // Render normal products for other tabs
            products?.map((product) => (
              <Product
                {...product}
                key={`card-${product?.id}`}
                // You can pass the heading as a prop if needed for other tabs
              />
            ))
          )}
        </Block>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  boldCenterText: {
    textAlign: 'center',
  },
});

export default Home;
 