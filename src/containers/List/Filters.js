import React, {useCallback, useMemo, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {Chip, Portal, useTheme} from 'react-native-paper';
import {useAtom, useAtomValue} from 'jotai';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import {
  appState,
  categoriesState,
  categoryFilterState,
  favoriteFilterState,
} from '../../store/store';

function Filters() {
  const theme = useTheme();
  const categories = useAtomValue(categoriesState);
  const [categoryFilter, setCategoryFilter] = useAtom(categoryFilterState);
  const [favoriteFilter, setFavoriteFilter] = useAtom(favoriteFilterState);
  const app = useAtomValue(appState);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['75%'], []);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  const toggleCategoryFilter = category => {
    if (categoryFilter.includes(category)) {
      setCategoryFilter(categoryFilter.filter(c => c !== category));
    } else {
      setCategoryFilter(categoryFilter.concat(category));
    }
  };

  return (
    <>
      <View style={styles.filterBar}>
        <Chip
          mode="outlined"
          style={styles.filterChip}
          icon="filter-outline"
          onPress={() => bottomSheetRef.current.snapToIndex(0)}>
          Catégorie
          {categoryFilter.length ? ` (${categoryFilter.length})` : null}
        </Chip>
        <Chip
          mode="outlined"
          style={styles.filterChip}
          icon="heart-outline"
          selected={favoriteFilter}
          onClose={favoriteFilter ? () => setFavoriteFilter(false) : null}
          onPress={() => setFavoriteFilter(!favoriteFilter)}>
          Favoris
        </Chip>
      </View>
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          enablePanDownToClose
          backgroundStyle={{backgroundColor: theme.colors.background}}>
          <BottomSheetScrollView>
            <View style={styles.sheet}>
              {categories.map(category => (
                <Chip
                  key={category.name}
                  mode="outlined"
                  style={styles.category}
                  onPress={() => toggleCategoryFilter(category.name)}
                  selected={categoryFilter.includes(category.name)}>
                  {app?.categories?.[category.name] || category.name} (
                  {category.count})
                </Chip>
              ))}
            </View>
          </BottomSheetScrollView>
        </BottomSheet>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  filterChip: {
    marginRight: 5,
  },
  sheet: {
    padding: 10,
  },
  category: {
    margin: 5,
  },
});

export default Filters;
