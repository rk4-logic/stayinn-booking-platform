export const schemaOptions = {
  timestamps: true,
  versionKey: false,
  id: false,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
} as const;