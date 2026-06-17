import mongoose, { Schema, Document, Model } from "mongoose";
import type {
  TimelineEvent,
  Headline,
  Economy,
  FamousPerson,
  MapData,
} from "../types.js";

export interface ScenarioDocument extends Document {
  question: string;
  title: string;
  premise: string;
  divergencePoint: string;
  timeline: TimelineEvent[];
  headlines: Headline[];
  economy: Economy;
  famousPeople: FamousPerson[];
  map: MapData;
  createdAt: Date;
  updatedAt: Date;
}

const TimelineEventSchema = new Schema(
  { year: String, event: String },
  { _id: false }
);

const HeadlineSchema = new Schema(
  { year: String, outlet: String, headline: String, summary: String },
  { _id: false }
);

const EconomySchema = new Schema(
  {
    globalGdpTrillions: Number,
    summary: String,
    topEconomies: [
      { country: String, gdpTrillions: Number, note: String },
    ],
  },
  { _id: false }
);

const PersonSchema = new Schema(
  { name: String, role: String, bio: String },
  { _id: false }
);

const RegionSchema = new Schema(
  { name: String, status: String, description: String, color: String },
  { _id: false }
);

const MapSchema = new Schema(
  { summary: String, regions: [RegionSchema] },
  { _id: false }
);

const ScenarioSchema = new Schema<ScenarioDocument>(
  {
    question: { type: String, required: true, trim: true },
    title: String,
    premise: String,
    divergencePoint: String,
    timeline: [TimelineEventSchema],
    headlines: [HeadlineSchema],
    economy: EconomySchema,
    famousPeople: [PersonSchema],
    map: MapSchema,
  },
  { timestamps: true }
);

ScenarioSchema.index({ question: 1 });

const Scenario: Model<ScenarioDocument> = mongoose.model<ScenarioDocument>(
  "Scenario",
  ScenarioSchema
);

export default Scenario;
