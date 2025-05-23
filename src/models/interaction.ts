import { model, Schema } from "mongoose";
import { IInteraction } from "../types/interaction.types";

const InteractionSchema = new Schema<IInteraction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Reader', required: true },
    contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true },
    interactionType: {
      type: String,
      enum: ['view', 'like', 'rating', 'share', 'save', 'click', 'comment'],
      required: true
    },
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

// Index for faster queries on user-content interactions
InteractionSchema.index({ userId: 1, contentId: 1 });
InteractionSchema.index({ contentId: 1, interactionType: 1 });

export const Interaction = model<IInteraction>('Interaction', InteractionSchema);