module.exports = {
    en: {
        translation: {
            CASES_TITLE: 'COVID-19 Cases',
            CASES_MSG: 'There are {{casesActive}} active cases, {{casesNew}} new cases as of {{regionDate}} in {{subIntent}}. There have been a total of {{casesAll}} cases in {{subIntent}}.',
            CASES_NOTFOUND_MSG: 'I was unable to find the case data for {{regionDate}} in {{subIntent}}.',
            MORTALITY_TITLE: 'COVID-19 Mortality',
            MORTALITY_MSG: 'The mortality rate is {{mortalityAll}}% as of {{regionDate}} in {{subIntent}}. There were {{deathsToday}} deaths and {{casesToday}} new cases.',
            MORTALITY_NOTFOUND_MSG: 'I was unable to find the mortality data for {{regionDate}} in {{subIntent}}.',
            GROWTH_TITLE: 'COVID-19 New Case Growth Rate',
            GROWTH_MSG : 'The growth rate of new cases is {{growth1Day}} in the past day, {{growth3Day}} in the past 3 days, and {{growth7Day}} in the past 7 days in {{subIntent}}.',
            GROWTH_NOTFOUND_MSG : 'I was unable to find growth data for {{subIntent}}.',
            REPORT_TITLE : 'COVID-19 Situation Report',
            REPORT_MSG : 'Yesterday there were {{casesNew}} new cases, {{deathsNew}} new deaths, and a total of {{casesActive}} active cases in {{subIntent}}.  {{subIntent}} has seen a new case growth rate of {{growth3Day}} in the past 3 days and a overall mortality rate of {{mortalityAll}}%.',
            HELP_MSG: 'You can ask about cases, mortality, and growth rate of the covid 19 virus.',
            HELP_REPROMPT: 'Please try again.',
            GOODBYE_MSG: 'Goodbye!',
            REFLECTOR_MSG: 'You just triggered {{intentName}}',
            FALLBACK_MSG: 'Sorry, I don\'t have the data for that.',
            FALLBACK_REPROMPT: 'Try again?',
            ERROR_MSG: 'Sorry, I couldn\'t calculate that. Please try again.',
            STOP_MSG: 'Canceling.'
        }
    },
    es: {
        translation: {
            WELCOME_MSG: 'Bienvenido, puedes decir Hola o Ayuda. Cual prefieres?',
            HELLO_MSG: 'Hola Mundo!',
            HELP_MSG: 'Puedes decirme hola. Cómo te puedo ayudar?',
            GOODBYE_MSG: 'Hasta luego!',
            REFLECTOR_MSG: 'Acabas de activar {{intentName}}',
            FALLBACK_MSG: 'Lo siento, no se nada sobre eso. Por favor inténtalo otra vez.',
            ERROR_MSG: 'Lo siento, ha habido un error. Por favor inténtalo otra vez.'
        }
    },
    de: {
        translation: {
            WELCOME_MSG: 'Wilkommen, du kannst Hallo oder Hilfe sagen. Was würdest du gern tun?',
            HELLO_MSG: 'Hallo!',
            HELP_MSG: 'Du kannst hallo zu mir sagen. Wie kann ich dir helfen?',
            GOODBYE_MSG: 'Tschüss!',
            REFLECTOR_MSG: 'Du hast gerade {{intentName}} ausgelöst',
            FALLBACK_MSG: 'Es tut mir leid, ich weiss das nicht. Bitte versuche es erneut.',
            ERROR_MSG: 'Es tut mir leid, ich konnte das nicht machen. Bitte versuche es erneut.'
        }
    },
    ja: {
        translation: {
            WELCOME_MSG: 'ようこそ。こんにちは、または、ヘルプ、と言ってみてください。どうぞ！',
            HELLO_MSG: 'ハローワールド',
            HELP_MSG: 'こんにちは、と言ってみてください。どうぞ！',
            GOODBYE_MSG: 'さようなら',
            REFLECTOR_MSG: '{{intentName}}がトリガーされました。',
            FALLBACK_MSG: 'ごめんなさい。ちょっとよくわかりませんでした。もう一度言ってみてください。',
            ERROR_MSG: 'ごめんなさい。なんだかうまく行かないようです。もう一度言ってみてください。'
        }
    },
    fr: {
        translation: {
            WELCOME_MSG: 'Bienvenue sur le génie des salutations, dites-moi bonjour et je vous répondrai',
            HELLO_MSG: 'Bonjour à tous!',
            HELP_MSG: 'Dites-moi bonjour et je vous répondrai!',
            GOODBYE_MSG: 'Au revoir!',
            REFLECTOR_MSG: 'Vous avez invoqué l\'intention {{intentName}}',
            FALLBACK_MSG: 'Désolé, je ne sais pas. Pouvez-vous reformuler?',
            ERROR_MSG: 'Désolé, je n\'ai pas compris. Pouvez-vous reformuler?'
        }
    },
    it: {
        translation: {
            WELCOME_MSG: 'Buongiorno! Puoi salutarmi con un ciao, o chiedermi aiuto. Cosa preferisci fare?',
            HELLO_MSG: 'Ciao!',
            HELP_MSG: 'Dimmi ciao e io ti risponderò! Come posso aiutarti?',
            GOODBYE_MSG: 'A presto!',
            REFLECTOR_MSG: 'Hai invocato l\'intento {{intentName}}',
            FALLBACK_MSG: 'Perdonami, penso di non aver capito bene. Riprova.',
            ERROR_MSG: 'Scusa, c\'è stato un errore. Riprova.'
        }
    },
    pt: {
        translation: {
            WELCOME_MSG: 'Bem vindo, você pode dizer Olá ou Ajuda. Qual você gostaria de fazer?',
            HELLO_MSG: 'Olá!',
            HELP_MSG: 'Você pode dizer olá para mim. Como posso te ajudar?',
            GOODBYE_MSG: 'Tchau!',
            REFLECTOR_MSG: 'Você acabou de ativar {{intentName}}',
            FALLBACK_MSG: 'Desculpe, não sei o que dizer. Por favor tente novamente.',
            ERROR_MSG: 'Desculpe, não consegui fazer o que você pediu. Por favor tente novamente.'
        }
    },
    hi: {
        translation: {
            WELCOME_MSG: 'नमस्ते, आप hello या help कह सकते हैं. आप क्या करना चाहेंगे?',
            HELLO_MSG: 'नमस्ते दुनिया ',
            HELP_MSG: 'आप मुझसे hello बोल सकते हो.',
            GOODBYE_MSG: 'अलविदा ',
            REFLECTOR_MSG: 'आपने {{intentName}} trigger किया हैं ',
            FALLBACK_MSG: 'Sorry, मैं वो समझ नहीं पायी. क्या आप दोहरा सकते हैं ',
            ERROR_MSG: 'Sorry, मैं वो समझ नहीं पायी. क्या आप दोहरा सकते हैं '
        }
    }
}
