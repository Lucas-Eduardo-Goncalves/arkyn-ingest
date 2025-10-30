-- CreateIndex
CREATE INDEX "HttpTraffic_createdAt_level_trafficSourceId_domainId_pathna_idx" ON "HttpTraffic"("createdAt", "level", "trafficSourceId", "domainId", "pathnameId", "method", "status");
