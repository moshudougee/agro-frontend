import { create } from "zustand";

interface OrderState {
    orderUnits: OrderUnit[];
    totalAmt: number;
    count: number;
    addOrderUnit: (unit: OrderUnit) => void;
    removeOrderUnit: (index: number) => void;
    clearOrder: () => void;
}

const LOCAL_STORAGE_KEY = "orderStore";

// Load initial state from localStorage
const loadState = (): OrderState => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : { orderUnits: [], totalAmt: 0, count: 0 };
};

export const useOrderStore = create<OrderState>((set) => {
    const initialState = loadState();

    return {
        ...initialState,

        addOrderUnit: (unit) => {
            set((state) => {
                const { landSize, fertilizerID, seedsID, fertilizerAmt, seedsAmt } = unit;

                // Check for duplicate entries
                const isDuplicate = state.orderUnits.some(
                    (existingUnit) =>
                        existingUnit.landSize === landSize &&
                        existingUnit.fertilizerID === fertilizerID &&
                        existingUnit.seedsID === seedsID
                );

                if (isDuplicate) {
                    return state; // Do not add duplicate entry
                }

                const newState = {
                    orderUnits: [...state.orderUnits, unit],
                    totalAmt: state.totalAmt + fertilizerAmt + seedsAmt,
                    count: state.count + 1
                };

                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
                return newState;
            });
        },

        removeOrderUnit: (index) => {
            set((state) => {
                if (index < 0 || index >= state.orderUnits.length) return state; // Prevent invalid index access

                const removedUnit = state.orderUnits[index];
                const newState = {
                    totalAmt: state.totalAmt - (removedUnit.fertilizerAmt + removedUnit.seedsAmt),
                    orderUnits: state.orderUnits.filter((_, i) => i !== index),
                    count: state.count - 1
                };

                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
                return newState;
            });
        },

        clearOrder: () => {
            set(() => {
                localStorage.removeItem(LOCAL_STORAGE_KEY);
                return {
                    orderUnits: [],
                    totalAmt: 0,
                    count: 0
                };
            });
        },
    };
});
