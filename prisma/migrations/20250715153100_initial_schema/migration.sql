-- CreateEnum
CREATE TYPE "Method" AS ENUM ('post', 'put', 'patch', 'delete', 'get');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('info', 'fatal', 'warning');

-- CreateEnum
CREATE TYPE "WebhookType" AS ENUM ('discord');

-- CreateEnum
CREATE TYPE "SharePermission" AS ENUM ('READ_ONLY');

-- CreateEnum
CREATE TYPE "Protocol" AS ENUM ('http', 'https');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "utc" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrafficSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "trafficDomain" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrafficSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Webhook" (
    "id" TEXT NOT NULL,
    "type" "WebhookType" NOT NULL,
    "level" "Level" NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "trafficSourceId" TEXT NOT NULL,

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrafficSourceShare" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "sharedWithId" TEXT NOT NULL,
    "trafficSourceId" TEXT NOT NULL,
    "permission" "SharePermission" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrafficSourceShare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "protocol" "Protocol" NOT NULL,
    "trafficSourceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pathname" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "trafficSourceId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pathname_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HttpTraffic" (
    "id" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "method" "Method" NOT NULL,
    "level" "Level" NOT NULL,
    "trafficUserId" TEXT,
    "trafficSourceId" TEXT NOT NULL,
    "elapsedTime" INTEGER NOT NULL,
    "domainId" TEXT NOT NULL,
    "pathnameId" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HttpTraffic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "headers" JSONB NOT NULL,
    "body" JSONB,
    "queryParams" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL,
    "headers" JSONB NOT NULL,
    "body" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoreLog" (
    "id" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "method" "Method" NOT NULL,
    "level" "Level" NOT NULL,
    "elapsedTime" INTEGER NOT NULL,
    "trafficUserId" TEXT,
    "corePathnameId" TEXT NOT NULL,
    "trafficSourceId" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoreLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorePathname" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "trafficSourceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CorePathname_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exception" (
    "id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" TEXT NOT NULL,
    "firstSeenAt" TIMESTAMP(3) NOT NULL,
    "lastSeenAt" TIMESTAMP(3) NOT NULL,
    "trafficSourceId" TEXT NOT NULL,
    "corePathnameId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exception_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExceptionOccurrence" (
    "id" TEXT NOT NULL,
    "exceptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExceptionOccurrence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Webhook_trafficSourceId_key" ON "Webhook"("trafficSourceId");

-- CreateIndex
CREATE INDEX "TrafficSourceShare_sharedWithId_idx" ON "TrafficSourceShare"("sharedWithId");

-- CreateIndex
CREATE INDEX "TrafficSourceShare_trafficSourceId_idx" ON "TrafficSourceShare"("trafficSourceId");

-- CreateIndex
CREATE UNIQUE INDEX "TrafficSourceShare_ownerId_sharedWithId_trafficSourceId_key" ON "TrafficSourceShare"("ownerId", "sharedWithId", "trafficSourceId");

-- CreateIndex
CREATE UNIQUE INDEX "HttpTraffic_requestId_key" ON "HttpTraffic"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "HttpTraffic_responseId_key" ON "HttpTraffic"("responseId");

-- CreateIndex
CREATE UNIQUE INDEX "CoreLog_requestId_key" ON "CoreLog"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "CoreLog_responseId_key" ON "CoreLog"("responseId");

-- CreateIndex
CREATE UNIQUE INDEX "Exception_hash_key" ON "Exception"("hash");

-- AddForeignKey
ALTER TABLE "TrafficSource" ADD CONSTRAINT "TrafficSource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_trafficSourceId_fkey" FOREIGN KEY ("trafficSourceId") REFERENCES "TrafficSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrafficSourceShare" ADD CONSTRAINT "TrafficSourceShare_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrafficSourceShare" ADD CONSTRAINT "TrafficSourceShare_sharedWithId_fkey" FOREIGN KEY ("sharedWithId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrafficSourceShare" ADD CONSTRAINT "TrafficSourceShare_trafficSourceId_fkey" FOREIGN KEY ("trafficSourceId") REFERENCES "TrafficSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_trafficSourceId_fkey" FOREIGN KEY ("trafficSourceId") REFERENCES "TrafficSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pathname" ADD CONSTRAINT "Pathname_trafficSourceId_fkey" FOREIGN KEY ("trafficSourceId") REFERENCES "TrafficSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pathname" ADD CONSTRAINT "Pathname_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HttpTraffic" ADD CONSTRAINT "HttpTraffic_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HttpTraffic" ADD CONSTRAINT "HttpTraffic_trafficSourceId_fkey" FOREIGN KEY ("trafficSourceId") REFERENCES "TrafficSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HttpTraffic" ADD CONSTRAINT "HttpTraffic_pathnameId_fkey" FOREIGN KEY ("pathnameId") REFERENCES "Pathname"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HttpTraffic" ADD CONSTRAINT "HttpTraffic_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HttpTraffic" ADD CONSTRAINT "HttpTraffic_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoreLog" ADD CONSTRAINT "CoreLog_corePathnameId_fkey" FOREIGN KEY ("corePathnameId") REFERENCES "CorePathname"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoreLog" ADD CONSTRAINT "CoreLog_trafficSourceId_fkey" FOREIGN KEY ("trafficSourceId") REFERENCES "TrafficSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoreLog" ADD CONSTRAINT "CoreLog_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoreLog" ADD CONSTRAINT "CoreLog_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorePathname" ADD CONSTRAINT "CorePathname_trafficSourceId_fkey" FOREIGN KEY ("trafficSourceId") REFERENCES "TrafficSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exception" ADD CONSTRAINT "Exception_trafficSourceId_fkey" FOREIGN KEY ("trafficSourceId") REFERENCES "TrafficSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exception" ADD CONSTRAINT "Exception_corePathnameId_fkey" FOREIGN KEY ("corePathnameId") REFERENCES "CorePathname"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExceptionOccurrence" ADD CONSTRAINT "ExceptionOccurrence_exceptionId_fkey" FOREIGN KEY ("exceptionId") REFERENCES "Exception"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
