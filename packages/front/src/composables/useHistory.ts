import { ref, computed } from "vue";
import { Irs } from "core";

export const countersSymbol = Symbol("historyCounters");
export interface HistoryCoutners {
  back: number;
  forward: number;
}

export function useHistory() {
  const backHistory = ref<Irs[]>([]);
  const forwardHistory = ref<Irs[]>([]);

  return {
    counters: computed<HistoryCoutners>(() => ({
      back: backHistory.value.length,
      forward: forwardHistory.value.length
    })),
    add(irs: Irs) {
      forwardHistory.value = [];
      backHistory.value.push(irs);
    },
    back(currentIrs: Irs): Irs {
      const irs = backHistory.value.pop();
      if (irs) {
        forwardHistory.value.unshift(currentIrs);
        return irs;
      } else throw Error("Missing back history entry!");
    },
    forward(currentIrs: Irs): Irs {
      const irs = forwardHistory.value.shift();
      if (irs) {
        backHistory.value.push(currentIrs);
        return irs;
      } else throw Error("Missing forward history entry!");
    },
    clear() {
      backHistory.value = [];
      forwardHistory.value = [];
    }
  };
}
