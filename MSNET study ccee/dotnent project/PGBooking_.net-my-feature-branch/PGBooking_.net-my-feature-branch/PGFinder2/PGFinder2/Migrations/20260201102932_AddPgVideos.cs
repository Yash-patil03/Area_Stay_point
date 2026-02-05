using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PGFinder2.Migrations
{
    /// <inheritdoc />
    public partial class AddPgVideos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Clean up orphaned records to prevent FK constraint failure
            migrationBuilder.Sql("DELETE FROM DiscountRequests WHERE PGId IS NOT NULL AND PGId NOT IN (SELECT PGId FROM PGs)");
            migrationBuilder.Sql("DELETE FROM DiscountRequests WHERE UserId IS NOT NULL AND UserId NOT IN (SELECT UserId FROM Users)");

            // Ensure PGVideos table exists (in case it was missed in previous migrations)
            migrationBuilder.Sql(@"
                IF OBJECT_ID('dbo.PGVideos', 'U') IS NULL
                BEGIN
                    CREATE TABLE [PGVideos] (
                        [PGVideoId] int NOT NULL IDENTITY,
                        [PGId] int NOT NULL,
                        [VideoUrl] nvarchar(max) NOT NULL,
                        [UploadedAt] datetime2 NOT NULL,
                        CONSTRAINT [PK_PGVideos] PRIMARY KEY ([PGVideoId]),
                        CONSTRAINT [FK_PGVideos_PGs_PGId] FOREIGN KEY ([PGId]) REFERENCES [PGs] ([PGId]) ON DELETE CASCADE
                    );
                    CREATE INDEX [IX_PGVideos_PGId] ON [PGVideos] ([PGId]);
                END
            ");

            migrationBuilder.CreateIndex(
                name: "IX_DiscountRequests_PGId",
                table: "DiscountRequests",
                column: "PGId");

            migrationBuilder.CreateIndex(
                name: "IX_DiscountRequests_UserId",
                table: "DiscountRequests",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_DiscountRequests_PGs_PGId",
                table: "DiscountRequests",
                column: "PGId",
                principalTable: "PGs",
                principalColumn: "PGId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DiscountRequests_Users_UserId",
                table: "DiscountRequests",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DiscountRequests_PGs_PGId",
                table: "DiscountRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_DiscountRequests_Users_UserId",
                table: "DiscountRequests");

            migrationBuilder.DropIndex(
                name: "IX_DiscountRequests_PGId",
                table: "DiscountRequests");

            migrationBuilder.DropIndex(
                name: "IX_DiscountRequests_UserId",
                table: "DiscountRequests");
        }
    }
}
