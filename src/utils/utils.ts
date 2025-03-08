export const ITEMS_PER_PAGE = 5

export const calculateQuantity = (landSize: number) => {
    const MAX_FERTILIZER_PER_ACRE = 3
    const MAX_SEEDS_PER_ACRE = 1

    const fertilizerQty = Math.floor(landSize * MAX_FERTILIZER_PER_ACRE)
    const seedsQty = landSize * MAX_SEEDS_PER_ACRE

    return {
        fertilizerQty,
        seedsQty
    }

}

export const formatCurrency = (amount:  number, locale = "en-US", currency = "KSh") => {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
}