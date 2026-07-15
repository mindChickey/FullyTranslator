
import { z } from "zod"

export type TranslateResultT = {
  succ: boolean
  srcLang: string
  srcText: string
  targetLines: string[]
}

const RuleSchema = z.object({
  pattern: z.string(),
  selectors: z.array(z.string())
})

export type RuleT = z.infer<typeof RuleSchema>

export const RuleMapSchema = z.record(z.string(), z.array(RuleSchema))
export type RuleMapT = z.infer<typeof RuleMapSchema>

export const OpenMapSchema = z.record(z.string(), z.boolean())
export type OpenMapT = z.infer<typeof OpenMapSchema>

export const ConfigSchema = z.object({
  language: z.string(),
  ruleMap: RuleMapSchema,
  openMap: OpenMapSchema
})

export type ConfigT = z.infer<typeof ConfigSchema>