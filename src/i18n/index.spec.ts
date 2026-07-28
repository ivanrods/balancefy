import { getTranslations, getDictionary, deepGet } from "./index";

describe("i18n", () => {
  describe("getTranslations", () => {
    it("returns pt-BR translation for existing key", () => {
      const t = getTranslations("pt-BR");
      expect(t("common.save")).toBe("Salvar");
    });

    it("returns en translation for existing key", () => {
      const t = getTranslations("en");
      expect(t("common.save")).toBe("Save");
    });

    it("falls back to pt-BR when key is missing in en", () => {
      const t = getTranslations("en");
      expect(t("landing.footer")).toBe("© {year} Balancefy. All rights reserved.");
    });

    it("returns the key itself when not found in any locale", () => {
      const t = getTranslations("pt-BR");
      expect(t("nonexistent.key")).toBe("nonexistent.key");
    });

    it("interpolates params", () => {
      const t = getTranslations("pt-BR");
      expect(t("table.rowsSelected", { count: 5, total: 10 })).toBe(
        "5 de 10 linha(s) selecionada(s)",
      );
    });

    it("interpolates params in en", () => {
      const t = getTranslations("en");
      expect(t("table.rowsSelected", { count: 3, total: 7 })).toBe("3 of 7 row(s) selected");
    });

    it("accesses deeply nested keys", () => {
      const t = getTranslations("pt-BR");
      expect(t("reports.charts.spendingDistribution")).toBe("Distribuição de Gastos");
    });
  });

  describe("getDictionary", () => {
    it("returns pt-BR dictionary", () => {
      const dict = getDictionary("pt-BR");
      expect((dict.common as Record<string, string>).save).toBe("Salvar");
    });

    it("returns en dictionary", () => {
      const dict = getDictionary("en");
      expect((dict.common as Record<string, string>).save).toBe("Save");
    });
  });

  describe("deepGet", () => {
    it("returns value for existing path", () => {
      expect(deepGet({ a: { b: "c" } }, "a.b")).toBe("c");
    });

    it("returns undefined for non-existent path", () => {
      expect(deepGet({ a: { b: "c" } }, "a.x")).toBeUndefined();
    });

    it("returns undefined for partial path", () => {
      expect(deepGet({ a: { b: "c" } }, "a.b.c")).toBeUndefined();
    });

    it("returns undefined when value is not a string", () => {
      expect(deepGet({ a: { b: 123 } }, "a.b")).toBeUndefined();
    });
  });
});
