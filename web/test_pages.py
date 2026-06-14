#!/usr/bin/env python3
"""
i18n Playwright Test Template
=============================
Runs comprehensive locale + page matrix verification for Next.js App Router + next-intl apps.
"""

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Tuple, Any

from playwright.sync_api import sync_playwright

DEFAULT_LOCALES = ["ru", "de", "uk", "ro"]

# Standard AmtHelper page matrix — adjust per project
DEFAULT_PAGES: List[Tuple[str, str]] = [
    ("dashboard", "/{locale}/dashboard"),
    ("analyzer", "/{locale}/modules/document-analyzer"),
    ("deadlines", "/{locale}/modules/deadline-tracker"),
    ("checklist", "/{locale}/modules/checklist"),
    ("letters", "/{locale}/modules/letter-generator"),
    ("templates", "/{locale}/modules/templates"),
    ("signin", "/{locale}/auth/signin"),
    ("signup", "/{locale}/auth/signup"),
    ("impressum", "/{locale}/impressum"),
    ("datenschutz", "/{locale}/datenschutz"),
]

# Demo credentials (adjust per project)
DEMO_EMAIL = "demo@amthelper.de"
DEMO_PASSWORD = "AmtHelper#2026!"

# Cookie banner button texts across locales
COOKIE_ACCEPT_TEXTS = [
    "Alle akzeptieren",
    "Accept all",
    "Принять все",
    "Acceptă toate",
    "Accept all cookies",
]

def build_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="i18n Playwright test runner")
    parser.add_argument("--base-url", default="http://localhost:3000", help="Base URL of running app")
    parser.add_argument("--locales", nargs="+", default=DEFAULT_LOCALES, help="Locales to test")
    parser.add_argument("--output-dir", default="screenshots", help="Screenshot output directory")
    parser.add_argument("--headless", action="store_true", default=True, help="Run headless")
    parser.add_argument("--no-login", action="store_true", help="Skip login (test public pages only)")
    parser.add_argument("--pages", nargs="+", help="Subset of page keys to test (e.g. signin signup)")
    return parser.parse_args()

def login(page, base_url: str, locale: str) -> bool:
    """Log in via signin page. Returns True if successful."""
    signin_url = f"{base_url}/{locale}/auth/signin"
    page.goto(signin_url, wait_until="networkidle")
    page.wait_for_timeout(1000)

    # Handle cookie banner
    for text in COOKIE_ACCEPT_TEXTS:
        try:
            btn = page.locator(f'button:has-text("{text}")')
            if btn.count() > 0:
                btn.first.click()
                page.wait_for_timeout(500)
                break
        except Exception:
            pass

    # Fill credentials
    page.fill('input[type="email"]', DEMO_EMAIL)
    page.fill('input[type="password"]', DEMO_PASSWORD)
    page.click('button[type="submit"]')
    page.wait_for_timeout(3000)

    # Verify login
    current_url = page.url
    return "dashboard" in current_url or "signin" not in current_url

def check_page(page, locale: str) -> Dict[str, Any]:
    """Run DOM checks on current page. Returns dict of check_name -> bool."""
    checks = {}

    # Sidebar nav items (adjust selectors for your sidebar structure)
    nav_items = ["dashboard", "document-analyzer", "deadline-tracker", "checklist", "letter-generator", "templates"]
    for item in nav_items:
        if item == "dashboard":
            selector = f'nav a[href*="/{locale}/dashboard"]'
        else:
            selector = f'nav a[href*="/{locale}/dashboard/modules/{item}"]'
        checks[f"nav_{item.replace('-', '_')}"] = page.locator(selector).count() > 0

    # Page structure
    checks["has_h1"] = page.locator("h1").count() > 0
    checks["has_buttons"] = page.locator("button").count() > 0
    checks["has_forms"] = page.locator("form").count() > 0
    checks["has_inputs"] = page.locator("input, textarea").count() > 0
    checks["has_footer"] = page.locator("footer").count() > 0

    # Error indicators
    checks["has_errors"] = page.locator('.error, [role="alert"], .text-red-500, .text-red-600').count() > 0

    # Title
    checks["title"] = page.title()

    return checks

def run_test(args: argparse.Namespace) -> List[Dict[str, Any]]:
    os.makedirs(args.output_dir, exist_ok=True)

    # Filter pages if subset requested
    pages = DEFAULT_PAGES
    if args.pages:
        page_keys = set(args.pages)
        pages = [(k, v) for k, v in DEFAULT_PAGES if k in page_keys]

    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=args.headless)
        context = browser.new_context(viewport={"width": 1920, "height": 1080})
        page = context.new_page()

        for locale in args.locales:
            print(f"\n=== Testing locale: {locale} ===")

            # Login unless --no-login
            if not args.no_login and locale != "signin" and locale != "signup":
                logged_in = login(page, args.base_url, locale)
                print(f"  Login: {'✅' if logged_in else '❌'}")

            for page_name, page_path in pages:
                url = f"{args.base_url}{page_path.format(locale=locale)}"
                print(f"  {page_name}: {url} ... ", end="", flush=True)

                try:
                    page.goto(url, wait_until="networkidle")
                    page.wait_for_timeout(1500)

                    # Screenshot
                    screenshot_path = Path(args.output_dir) / f"{locale}_{page_name}.png"
                    page.screenshot(path=str(screenshot_path), full_page=True)

                    # Checks
                    checks = check_page(page, locale)

                    # Record if 404
                    is_404 = "404" in checks.get("title", "") or "not found" in checks.get("title", "").lower()

                    # Debug: print checks
                    print(f"  DEBUG checks: {checks}")

                    # Convert boolean to int for sum
                    check_values = [int(v) if isinstance(v, bool) else (1 if v else 0) for v in checks.values()]
                    print(f"{'❌ 404' if is_404 else '✅'} | checks: {sum(check_values)}/{len(checks)}")

                    results.append({
                        "locale": locale,
                        "page": page_name,
                        "url": url,
                        "screenshot": str(screenshot_path),
                        "title": checks.pop("title", ""),
                        "checks": checks,
                        "is_404": is_404,
                    })

                except Exception as e:
                    print(f"❌ ERROR: {e}")
                    results.append({
                        "locale": locale,
                        "page": page_name,
                        "url": url,
                        "error": str(e),
                    })

        browser.close()

    # Save results
    results_path = Path(args.output_dir) / "results.json"
    with open(results_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)

    by_locale = {}
    for r in results:
        by_locale.setdefault(r["locale"], {"ok": 0, "error": 0, "not_found": 0})
        if "error" in r:
            by_locale[r["locale"]]["error"] += 1
        elif r.get("is_404"):
            by_locale[r["locale"]]["not_found"] += 1
        else:
            by_locale[r["locale"]]["ok"] += 1

    for locale, counts in by_locale.items():
        print(f"  {locale}: ✅ {counts['ok']}  ❌ 404 {counts['not_found']}  💥 {counts['error']}")

    total_ok = sum(c["ok"] for c in by_locale.values())
    total_404 = sum(c["not_found"] for c in by_locale.values())
    total_err = sum(c["error"] for c in by_locale.values())
    print(f"\n  TOTAL: ✅ {total_ok}  ❌ 404 {total_404}  💥 {total_err}")

    print(f"\nResults saved to: {results_path}")
    print(f"Screenshots in: {args.output_dir}/")

    return results

if __name__ == "__main__":
    args = build_args()
    run_test(args)