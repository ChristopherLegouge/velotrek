import { test, expect } from '@playwright/test'

test.describe('Authentification', () => {
  test('redirige vers /login si non connecté', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('affiche la page login avec les bons éléments', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: /bon retour/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/mot de passe/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /se connecter/i })).toBeVisible()
  })

  test('affiche une erreur si email vide', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /se connecter/i }).click()
    await expect(page.getByText(/email requis/i)).toBeVisible()
  })

  test('affiche la page register avec lien vers login', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('heading', { name: /commence l'aventure/i })).toBeVisible()
    await expect(page.getByText(/déjà un compte/i)).toBeVisible()
  })

  test('affiche la carte sur /planifier (après login)', async () => {
    // Nécessite un compte de test réel — à exécuter manuellement ou avec un fixture Playwright
    test.skip()
  })
})
