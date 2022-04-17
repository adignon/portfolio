-- CreateEnum
CREATE TYPE "AccountMetaKeys" AS ENUM ('LOGIN_BROWSER');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE');

-- CreateEnum
CREATE TYPE "ProjectMetaKey" AS ENUM ('GIT_REPOSITORY', 'APP_URL');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFTED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "GeneralMetaKey" AS ENUM ('PORTFOLIO_USER_IMAGE', 'PORTFOLIO_SLOGAN', 'PORTFOLIO_SUBSLOGAN', 'PORTFOLIO_DESCRIPTION', 'ROOT_USER_EMAIL', 'SETTINGS_PRIVACY', 'FILE_TYPE_REGEX');

-- CreateEnum
CREATE TYPE "KnowledgeTypes" AS ENUM ('LIBRARY', 'FRAMEWORK');

-- CreateEnum
CREATE TYPE "MailFlag" AS ENUM ('IMPORTANT', 'PENDING_REVIEW', 'REVIEWED');

-- CreateEnum
CREATE TYPE "MediaSources" AS ENUM ('CLOUDINARY', 'LOCAL', 'FIREBASE');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "hashPassword" VARCHAR(255) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountMeta" (
    "id" TEXT NOT NULL,
    "key" "AccountMetaKeys" NOT NULL,
    "value" JSONB NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "AccountMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT E'DRAFTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMeta" (
    "id" TEXT NOT NULL,
    "key" "ProjectMetaKey" NOT NULL,
    "value" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ProjectMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "fullPath" TEXT,
    "type" "MediaType" NOT NULL,
    "metaType" TEXT NOT NULL,
    "mediaMeta" JSONB NOT NULL,
    "source" "MediaSources" NOT NULL DEFAULT E'LOCAL',

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneralMeta" (
    "id" TEXT NOT NULL,
    "key" "GeneralMetaKey" NOT NULL,
    "value" JSONB,
    "mediaId" TEXT,

    CONSTRAINT "GeneralMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Knowloadge" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "progress" INTEGER NOT NULL,
    "type" "KnowledgeTypes" NOT NULL,

    CONSTRAINT "Knowloadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "senderEmail" TEXT NOT NULL,
    "senderFullname" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "badge" "MailFlag" NOT NULL,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageMeta" (
    "id" TEXT NOT NULL,
    "ipAdress" TEXT,
    "visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MediaToProject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_dowloadedMedias" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MediaToProject_AB_unique" ON "_MediaToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_MediaToProject_B_index" ON "_MediaToProject"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_dowloadedMedias_AB_unique" ON "_dowloadedMedias"("A", "B");

-- CreateIndex
CREATE INDEX "_dowloadedMedias_B_index" ON "_dowloadedMedias"("B");

-- AddForeignKey
ALTER TABLE "AccountMeta" ADD CONSTRAINT "AccountMeta_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMeta" ADD CONSTRAINT "ProjectMeta_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralMeta" ADD CONSTRAINT "GeneralMeta_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToProject" ADD FOREIGN KEY ("A") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToProject" ADD FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dowloadedMedias" ADD FOREIGN KEY ("A") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dowloadedMedias" ADD FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
