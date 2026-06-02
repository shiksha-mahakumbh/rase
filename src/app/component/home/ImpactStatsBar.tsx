"use client";

import React from "react";
import GlassCard from "./GlassCard";
import AnimatedCounter from "./AnimatedCounter";
import {
  ConferenceIcon,
  GlobeEducationIcon,
  KnowledgeIcon,
  LeadershipIcon,
} from "./icons";

const ImpactStatsBar: React.FC = () => {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 md:grid-cols-4 md:gap-6">
      <GlassCard className="p-4 md:p-6">
        <AnimatedCounter
          value={5}
          label="Major Editions"
          icon={<ConferenceIcon className="h-5 w-5" />}
        />
      </GlassCard>
      <GlassCard className="p-4 md:p-6">
        <AnimatedCounter
          value={6}
          suffix=".0"
          label="Current Edition"
          icon={<GlobeEducationIcon className="h-5 w-5" />}
        />
      </GlassCard>
      <GlassCard className="p-4 md:p-6">
        <AnimatedCounter
          value={2023}
          label="Movement Launch Year"
          icon={<KnowledgeIcon className="h-5 w-5" />}
        />
      </GlassCard>
      <GlassCard className="p-4 md:p-6">
        <AnimatedCounter
          value={2047}
          label="Bharat@2047 Vision"
          icon={<LeadershipIcon className="h-5 w-5" />}
        />
      </GlassCard>
    </div>
  );
};

export default ImpactStatsBar;
