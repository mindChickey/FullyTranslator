
import { z } from "zod"

export type TranslateResultT = {
  succ: boolean
  text: string
}

const RuleSchema = z.object({
  pattern: z.string(),
  selectors: z.array(z.string())
})

export type RuleT = z.infer<typeof RuleSchema>

const RuleMapSchema = z.record(z.string(), z.array(RuleSchema))
export type RuleMapT = z.infer<typeof RuleMapSchema>

const OpenMapSchema = z.record(z.string(), z.boolean())
export type OpenMapT = z.infer<typeof OpenMapSchema>

const ConfigSchema = z.object({
  language: z.string(),
  ruleMap: RuleMapSchema,
  openMap: OpenMapSchema
})

export type ConfigT = z.infer<typeof ConfigSchema>