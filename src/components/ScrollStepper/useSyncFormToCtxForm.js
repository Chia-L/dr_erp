import { watch } from 'vue'
import { returnType } from '@/utils/tools'

export function useSyncToCtxFrom(watcher, emits) {
  watch(watcher, (watcher) => {
    if (returnType(watcher) !== 'object') {
      return {sync: false}
    }
    emits('syncFormToCtxForm', watcher)
  })
}
