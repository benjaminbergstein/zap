# Migration `20200403224007-init`

This migration has been generated at 4/3/2020, 10:40:07 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Game" (
    "createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" integer  NOT NULL ,
    "id" SERIAL,
    "title" text  NOT NULL ,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."Player" (
    "id" SERIAL,
    "name" text   ,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."_gamePlayers" (
    "A" integer  NOT NULL ,
    "B" integer  NOT NULL 
) 

CREATE  INDEX "creatorId" ON "public"."Game"("creatorId")

CREATE UNIQUE INDEX "_gamePlayers_AB_unique" ON "public"."_gamePlayers"("A","B")

CREATE  INDEX "_gamePlayers_B_index" ON "public"."_gamePlayers"("B")

ALTER TABLE "public"."Game" ADD FOREIGN KEY ("creatorId")REFERENCES "public"."Player"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."_gamePlayers" ADD FOREIGN KEY ("A")REFERENCES "public"."Game"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."_gamePlayers" ADD FOREIGN KEY ("B")REFERENCES "public"."Player"("id") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200403224007-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,29 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "postgresql"
+  url      = env("DATABASE_URL")
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+model Game {
+  id        Int      @default(autoincrement()) @id
+  createdAt DateTime @default(now())
+  title     String
+  creator   Player @relation(name: "gameCreators", fields: [creatorId], references: [id])
+  creatorId  Int
+  players   Player[] @relation(name: "gamePlayers", references: [id])
+
+  @@index([creatorId], name: "creatorId")
+}
+
+model Player {
+  id      Int      @default(autoincrement()) @id
+  name    String?
+  games Game[] @relation(name: "gamePlayers", references: [id])
+  createdGames Game[] @relation("gameCreators")
+}
```


