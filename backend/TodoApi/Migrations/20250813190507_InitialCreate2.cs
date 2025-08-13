using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_TodoItems_Description",
                table: "TodoItems",
                column: "Description");

            migrationBuilder.CreateIndex(
                name: "IX_TodoItems_DueDate",
                table: "TodoItems",
                column: "DueDate");

            migrationBuilder.CreateIndex(
                name: "IX_TodoItems_IsDone",
                table: "TodoItems",
                column: "IsDone");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TodoItems_Description",
                table: "TodoItems");

            migrationBuilder.DropIndex(
                name: "IX_TodoItems_DueDate",
                table: "TodoItems");

            migrationBuilder.DropIndex(
                name: "IX_TodoItems_IsDone",
                table: "TodoItems");
        }
    }
}
