-- CreateTable
CREATE TABLE "Activities" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivitiesUser" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "activityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivitiesUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActivitiesUser_userId_key" ON "ActivitiesUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ActivitiesUser_activityId_key" ON "ActivitiesUser"("activityId");

-- AddForeignKey
ALTER TABLE "ActivitiesUser" ADD CONSTRAINT "ActivitiesUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivitiesUser" ADD CONSTRAINT "ActivitiesUser_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
