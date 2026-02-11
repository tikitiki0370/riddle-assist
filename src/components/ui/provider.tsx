"use client"

import { ChakraProvider, createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"

const config = defineConfig({
  theme: {
    slotRecipes: {
      segmentGroup: {
        slots: ["root", "item", "indicator", "label", "itemText", "itemControl"],
        base: {
          item: { cursor: "pointer" },
        },
      },
    },
  },
})

const system = createSystem(defaultConfig, config)

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
