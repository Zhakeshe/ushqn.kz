import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Compass, ArrowRight, Check } from 'lucide-react'
import { AppPageMeta } from '../components/AppPageMeta'
import { useCopy } from '../product/useCopy'

export function RoadmapPage() {
  const copy = useCopy()
  const [selected, setSelected] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [done, setDone] = useState<string[]>([])
  const directions = [
    {
      id: 'tech',
      title: copy(
        'Технологии и инженерия',
        'Технология және инженерия',
        'Technology & engineering',
      ),
      interests: copy(
        'Роботы, код, математика, создание вещей',
        'Роботтар, код, математика, құрастыру',
        'Robots, coding, mathematics, building things',
      ),
      careers: copy(
        'Инженер, разработчик, исследователь',
        'Инженер, бағдарламашы, зерттеуші',
        'Engineer, developer, researcher',
      ),
      steps: [
        copy(
          'Собери небольшой проект и опиши результат',
          'Шағын жоба жасап, нәтижесін сипатта',
          'Build a small project and document the result',
        ),
        copy(
          'Найди олимпиаду по математике или программированию',
          'Математика немесе бағдарламалау олимпиадасын тап',
          'Find a mathematics or programming olympiad',
        ),
        copy(
          'Добавь проект в портфолио и попроси обратную связь',
          'Жобаны портфолиоға қосып, пікір сұра',
          'Add your project to your portfolio and ask for feedback',
        ),
      ],
    },
    {
      id: 'creative',
      title: copy(
        'Творчество и коммуникации',
        'Шығармашылық және коммуникация',
        'Creativity & communication',
      ),
      interests: copy(
        'Дизайн, музыка, тексты, выступления',
        'Дизайн, музыка, мәтін, сөз сөйлеу',
        'Design, music, writing, public speaking',
      ),
      careers: copy(
        'Дизайнер, автор, специалист по коммуникациям',
        'Дизайнер, автор, коммуникация маманы',
        'Designer, writer, communications specialist',
      ),
      steps: [
        copy(
          'Создай работу на тему, которая тебе важна',
          'Өзіңе маңызды тақырыпқа жұмыс жаса',
          'Create a piece about something that matters to you',
        ),
        copy(
          'Собери три работы в небольшой портфолио-проект',
          'Үш жұмыстан шағын портфолио жина',
          'Collect three pieces in a small portfolio project',
        ),
        copy(
          'Покажи работы наставнику и выбери навык для улучшения',
          'Жұмыстарыңды тәлімгерге көрсетіп, дамытатын дағды таңда',
          'Show your work to a mentor and choose a skill to improve',
        ),
      ],
    },
    {
      id: 'social',
      title: copy('Люди и общество', 'Адамдар және қоғам', 'People & society'),
      interests: copy(
        'Волонтёрство, обучение, языки, помощь людям',
        'Волонтёрлік, оқыту, тілдер, адамдарға көмек',
        'Volunteering, teaching, languages, helping people',
      ),
      careers: copy(
        'Педагог, социальный предприниматель, переводчик',
        'Педагог, әлеуметтік кәсіпкер, аудармашы',
        'Educator, social entrepreneur, translator',
      ),
      steps: [
        copy(
          'Присоединись к волонтёрскому или школьному проекту',
          'Волонтёрлік немесе мектеп жобасына қосыл',
          'Join a volunteering or school project',
        ),
        copy(
          'Помоги другому ученику разобраться в знакомой теме',
          'Басқа оқушыға таныс тақырыпты түсінуге көмектес',
          'Help another student understand a topic you know',
        ),
        copy(
          'Запиши, чему научился, и добавь опыт в портфолио',
          'Не үйренгеніңді жазып, тәжірибені портфолиоға қос',
          'Write down what you learned and add the experience to your portfolio',
        ),
      ],
    },
    {
      id: 'science',
      title: copy(
        'Наука и исследование',
        'Ғылым және зерттеу',
        'Science & discovery',
      ),
      interests: copy(
        'Эксперименты, природа, анализ данных',
        'Тәжірибелер, табиғат, деректерді талдау',
        'Experiments, nature, analyzing data',
      ),
      careers: copy(
        'Учёный, аналитик, эколог',
        'Ғалым, аналитик, эколог',
        'Scientist, analyst, environmental specialist',
      ),
      steps: [
        copy(
          'Выбери вопрос и сформулируй проверяемую гипотезу',
          'Сұрақ таңдап, тексеруге болатын гипотеза құрастыр',
          'Choose a question and form a testable hypothesis',
        ),
        copy(
          'Проведи безопасный эксперимент или исследуй открытые данные',
          'Қауіпсіз тәжірибе жаса немесе ашық деректерді зертте',
          'Run a safe experiment or explore open data',
        ),
        copy(
          'Оформи выводы в проект и обсуди с учителем',
          'Қорытындыны жобаға рәсімдеп, мұғаліммен талқыла',
          'Write up your findings and discuss them with a teacher',
        ),
      ],
    },
    {
      id: 'sport',
      title: copy(
        'Спорт и движение',
        'Спорт және қозғалыс',
        'Sports & movement',
      ),
      interests: copy(
        'Тренировки, соревнования, командная работа',
        'Жаттығу, жарыс, топтық жұмыс',
        'Training, competitions, teamwork',
      ),
      careers: copy(
        'Спортсмен, тренер, спортивный менеджер',
        'Спортшы, жаттықтырушы, спорт менеджері',
        'Athlete, coach, sports manager',
      ),
      steps: [
        copy(
          'Обсуди с тренером цель на ближайший месяц',
          'Жаттықтырушымен келесі айдың мақсатын талқыла',
          'Discuss a goal for the next month with your coach',
        ),
        copy(
          'Веди дневник тренировок и отмечай прогресс',
          'Жаттығу күнделігін жүргізіп, прогресті белгіле',
          'Keep a training journal and track your progress',
        ),
        copy(
          'Добавь подтверждённые результаты соревнований в портфолио',
          'Жарыстың расталған нәтижелерін портфолиоға қос',
          'Add verified competition results to your portfolio',
        ),
      ],
    },
  ]
  return (
    <div className="space-y-6">
      <AppPageMeta
        title={copy('Профориентация', 'Кәсіби бағдар', 'Career guidance')}
      />
      <header>
        <span className="text-xs font-bold uppercase tracking-widest text-violet-500">
          {copy('Твой следующий шаг', 'Сенің келесі қадамың', 'Your next step')}
        </span>
        <h1 className="mt-3 text-3xl">
          {copy(
            'Начни с того, что интересно.',
            'Қызықты нәрседен баста.',
            'Start with what interests you.',
          )}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-ushqn-muted)]">
          {copy(
            'Выбери интересы и получи несколько направлений для изучения. Это базовые рекомендации по выбранным интересам. AI-наставник пока не подключён.',
            'Қызығушылықтарыңды таңдап, зерттеуге болатын бағыттарды ал. Бұл таңдалған қызығушылықтарға негізделген ұсыныстар. AI-тәлімгер әзірге қосылмаған.',
            'Choose your interests to explore possible directions. These are basic interest-based suggestions. An AI mentor is not connected yet.',
          )}
        </p>
      </header>
      <form
        className="ushqn-card space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitted(true)
          setDone([])
        }}
      >
        <fieldset>
          <legend className="mb-4 text-sm font-bold">
            {copy(
              'Что тебе нравится?',
              'Саған не ұнайды?',
              'What do you enjoy?',
            )}
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {directions.map((d) => (
              <label
                key={d.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${selected.includes(d.id) ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/20' : 'border-[var(--color-ushqn-border)]'}`}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(d.id)}
                  onChange={(e) => {
                    setSelected(
                      e.target.checked
                        ? [...selected, d.id]
                        : selected.filter((x) => x !== d.id),
                    )
                    setSubmitted(false)
                  }}
                  className="mt-1 accent-violet-600"
                />
                <span>
                  <strong className="text-sm">{d.title}</strong>
                  <span className="mt-1 block text-xs text-[var(--color-ushqn-muted)]">
                    {d.interests}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <button
          disabled={!selected.length}
          className="ushqn-btn-primary flex items-center gap-3"
          type="submit"
        >
          <Compass size={16} />
          {copy('Посмотреть мой план', 'Жоспарымды көру', 'See my plan')}
        </button>
      </form>
      {submitted && (
        <section aria-live="polite" className="space-y-4">
          <h2 className="text-xl">
            {copy(
              'Направления для знакомства',
              'Танысуға арналған бағыттар',
              'Directions to explore',
            )}
          </h2>
          {directions
            .filter((d) => selected.includes(d.id))
            .map((d) => (
              <article className="ushqn-card" key={d.id}>
                <h3>{d.title}</h3>
                <p className="my-3 text-sm text-[var(--color-ushqn-muted)]">
                  {d.careers}
                </p>
                <ol className="space-y-2">
                  {d.steps.map((step, i) => {
                    const id = `${d.id}-${i}`
                    return (
                      <li key={id}>
                        <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-[var(--color-ushqn-surface-muted)] p-3 text-xs">
                          <input
                            type="checkbox"
                            checked={done.includes(id)}
                            onChange={(e) =>
                              setDone(
                                e.target.checked
                                  ? [...done, id]
                                  : done.filter((x) => x !== id),
                              )
                            }
                            className="accent-violet-600"
                          />
                          <span
                            className={
                              done.includes(id) ? 'line-through opacity-60' : ''
                            }
                          >
                            {step}
                          </span>
                          {done.includes(id) && (
                            <Check
                              size={14}
                              className="ml-auto text-emerald-500"
                            />
                          )}
                        </label>
                      </li>
                    )
                  })}
                </ol>
              </article>
            ))}
          <p className="text-xs text-[var(--color-ushqn-muted)]">
            {copy(
              'Это варианты для знакомства с профессиями. Обсуди выбор с родителями или учителем. План хранится до обновления страницы.',
              'Бұл мамандықтармен танысу нұсқалары. Таңдауды ата-анаңмен не мұғаліммен талқыла. Жоспар бет жаңартылғанға дейін сақталады.',
              'These are starting points for exploring careers. Discuss them with a parent or teacher. This plan lasts until the page is refreshed.',
            )}
          </p>
          <Link to="/marketplace" className="ushqn-btn-secondary gap-3">
            {copy('Найти наставника', 'Тәлімгер табу', 'Find a mentor')}
            <ArrowRight size={16} />
          </Link>
        </section>
      )}
    </div>
  )
}
