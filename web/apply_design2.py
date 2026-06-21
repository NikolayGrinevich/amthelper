#!/usr/bin/env python3
"""Apply design system classes to 4 module files."""
import os

files = {
    'letter-generator': r'C:\HERMES\projects\amthelper\web\app\[locale]\modules\letter-generator\page.tsx',
    'templates': r'C:\HERMES\projects\amthelper\web\app\[locale]\modules\templates\page.tsx',
    'deadline-tracker': r'C:\HERMES\projects\amthelper\web\app\[locale]\modules\deadline-tracker\page.tsx',
    'checklist': r'C:\HERMES\projects\amthelper\web\app\[locale]\modules\checklist\page.tsx',
}

replacements = [
    # === HEADERS ===
    ('<h1 className="text-3xl font-bold text-gray-900">{t', '<h1 className="page-title">{t'),
    ('<h2 className="text-2xl font-bold text-gray-900">{t', '<h2 className="page-title">{t'),
    ('<h1 className="text-3xl font-bold text-gray-900">', '<h1 className="page-title">'),
    ('<p className="text-gray-600 mt-1">{t(', '<p className="page-subtitle">{t('),
    ('<p className="text-gray-600">{t(', '<p className="page-subtitle">{t('),

    # === CARDS ===
    ('bg-white rounded-2xl border border-gray-200 shadow-sm', 'card'),
    ('bg-white rounded-2xl border shadow-sm', 'card'),
    ('rounded-2xl border shadow-sm', 'card'),

    # === PRIMARY BUTTONS ===
    ('bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition', 'btn-primary'),
    ('bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors', 'btn-primary'),
    ('bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium', 'btn-primary'),
    ('bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition', 'btn-primary'),
    ('bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition', 'btn-primary'),

    # === INPUTS ===
    ('border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent', 'card-input'),
    ('flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent', 'card-input flex-1'),

    # === TEMPLATE CARDS ===
    ('bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition', 'card p-4'),

    # === NO-DATA ===
    ("className='text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm'", "className='text-center py-16 card'"),

    # === ERROR ===
    ('bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm', 'card p-4 text-red-700 text-sm bg-red-50'),

    # === GENERATE BUTTON WIDE ===
    ("className='w-full px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-lg flex items-center justify-center gap-2'",
     "className='btn-primary w-full flex items-center justify-center gap-2'"),

    # === LETTER GEN TEXT ===
    ('<h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>', '<h1 className="page-title">{t.title}</h1>'),
    ('<p className="text-gray-600 mt-1">{t.subtitle}</p>', '<p className="page-subtitle">{t.subtitle}</p>'),
    ('<h2 className="text-2xl font-bold text-gray-900">{t.preview}</h2>', '<h2 className="page-title">{t.preview}</h2>'),

    # === LETTER GEN BACK ===
    ("className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition'", "className='btn-secondary'"),

    # === LETTER GEN COPY ===
    ("className='px-3 py-1.5 text-xs bg-white text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition font-medium'",
     "className='btn-secondary text-xs'"),

    # === LETTER GEN BANNERS ===
    ("className='bg-blue-50 border border-blue-200 rounded-xl p-4'", "className='card p-4 bg-blue-50'"),
    ("className='bg-blue-50 border border-blue-200 rounded-xl p-6'", "className='card p-5 bg-blue-50'"),
    ("className='bg-green-50 border border-green-200 rounded-xl p-6'", "className='card p-5 bg-green-50'"),

    # === LETTER GEN TEXTAREA ===
    ("className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'",
     "className='card-input w-full'"),

    # === LETTER GEN ICON ===
    ("className='w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-gray-100'",
     "className='w-10 h-10 rounded-md flex items-center justify-center text-xl bg-gray-100'"),

    # === TEMPLATE USE ===
    ("className='w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium'",
     "className='btn-primary w-full'"),

    # === CATEGORY ALL ===
    ("className={`px-4 py-2 rounded-lg transition text-sm font-medium ${" + "\n" +
     "            selectedCategory === 'all'" + "\n" +
     "              ? 'bg-blue-600 text-white'" + "\n" +
     "              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'" + "\n" +
     "          }`}",
     "className={`px-4 py-2 text-sm font-medium transition ${" + "\n" +
     "            selectedCategory === 'all'" + "\n" +
     "              ? 'btn-primary'" + "\n" +
     "              : 'btn-secondary'" + "\n" +
     "          }`}"),

    # === CATEGORY KEY ===
    ("className={`px-4 py-2 rounded-lg transition text-sm font-medium ${" + "\n" +
     "            selectedCategory === category.key" + "\n" +
     "              ? 'bg-blue-600 text-white'" + "\n" +
     "              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'" + "\n" +
     "          }`}",
     "className={`px-4 py-2 text-sm font-medium transition ${" + "\n" +
     "            selectedCategory === category.key" + "\n" +
     "              ? 'btn-primary'" + "\n" +
     "              : 'btn-secondary'" + "\n" +
     "          }`}"),

    # === DEADLINE ===
    ("className={`rounded-xl border-2 ${cfg.border} ${cfg.bg} p-4 text-center`}",
     "className={`card p-4 text-center ${cfg.bg}`}"),
    ("className={`rounded-2xl border-2 ${cfg.border} ${cfg.bg} p-5 flex items-center justify-between gap-4 transition-all hover:shadow-md`}",
     "className={`card p-4 flex items-center justify-between gap-4 ${cfg.bg}`}"),
    ("className='rounded-xl border border-gray-200 bg-white p-4 flex items-center justify-between gap-4 hover:border-gray-300 transition-colors'",
     "className='card p-4 flex items-center justify-between gap-4'"),
    ("className='flex-shrink-0 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors'",
     "className='btn-secondary flex-shrink-0'"),
    ("className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors'",
     "className='btn-primary flex items-center gap-2'"),

    # === CHECKLIST ===
    ("className='bg-white rounded-2xl border border-gray-200 shadow-sm p-6'", "className='card p-5'"),
    ("className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${allDone ? 'border-green-200' : 'border-gray-200'}`}",
     "className={`card overflow-hidden transition-all ${allDone ? 'border-green-200' : ''}`}"),
    ("className={`px-6 py-4 flex items-start justify-between gap-4 ${allDone ? 'bg-green-50' : 'bg-gray-50'} border-b ${allDone ? 'border-green-200' : 'border-gray-200'}`}",
     "className={`px-5 py-3 flex items-start justify-between gap-4 ${allDone ? 'bg-green-50' : 'bg-gray-50'}`}"),
    ("className={`flex items-start gap-4 px-6 py-4 cursor-pointer transition-colors ${isChecked ? 'bg-green-50/50' : 'hover:bg-gray-50'}`}",
     "className={`flex items-start gap-4 px-5 py-3 cursor-pointer transition-colors ${isChecked ? 'bg-green-50/50' : 'hover:bg-gray-50'}`}"),
    ("className='flex-shrink-0 text-xs text-gray-400 hover:text-red-500 transition-colors font-medium flex items-center gap-1'",
     "className='flex-shrink-0 text-xs text-muted hover:text-red-500 transition-colors font-medium flex items-center gap-1'"),
    ("className='text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3'",
     "className='text-sm font-semibold text-muted uppercase tracking-wider mb-3'"),
]

for name, fpath in files.items():
    with open(fpath, encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new, 1)
    
    token_count = sum(content.count(x) for x in ['btn-primary','card','page-title','card-input','btn-secondary','page-subtitle'])
    
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"{name}: {token_count} tokens")

print("Done!")
