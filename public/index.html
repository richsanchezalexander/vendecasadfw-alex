// VendeCasaDFW — Alex Proxy Function
// Keeps Anthropic API key server-side, away from browser
// Includes HubSpot CRM contact creation/update

const HUBSPOT_API_BASE = 'https://api.hubapi.com';

// ─────────────────────────────────────────
// HUBSPOT HELPERS
// ─────────────────────────────────────────

async function ensureCustomProperties() {
  const token = process.env.HUBSPOT_API_TOKEN;

  const customProps = [
    {
      name: 'callback_time',
      label: 'Horario de Contacto Preferido',
      type: 'enumeration',
      fieldType: 'select',
      options: [
        { label: 'Mañana (8am–12pm)', value: 'manana', displayOrder: 0, hidden: false },
        { label: 'Tarde (12pm–5pm)', value: 'tarde', displayOrder: 1, hidden: false },
        { label: 'Noche (5pm–8pm)', value: 'noche', displayOrder: 2, hidden: false },
        { label: 'Fin de semana — mañana (8am–12pm)', value: 'fin_de_semana', displayOrder: 3, hidden: false },
        { label: 'Cualquier hora', value: 'cualquier_hora', displayOrder: 4, hidden: false }
      ]
    },
    {
      name: 'alex_intent',
      label: 'Alex — Intención del Propietario',
      type: 'string',
      fieldType: 'text'
    },
    {
      name: 'alex_reason',
      label: 'Alex — Razón del Cambio',
      type: 'string',
      fieldType: 'textarea'
    },
    {
      name: 'alex_urgency',
      label: 'Alex — Urgencia',
      type: 'enumeration',
      fieldType: 'select',
      options: [
        { label: 'Temprana (1-2 meses)', value: 'early', displayOrder: 0, hidden: false },
        { label: 'Media (3-6 meses)', value: 'mid', displayOrder: 1, hidden: false },
        { label: 'Crítica (ejecución en proceso)', value: 'critical', displayOrder: 2, hidden: false },
        { label: 'No aplica', value: 'na', displayOrder: 3, hidden: false }
      ]
    },
    {
      name: 'alex_category',
      label: 'Alex — Categoría',
      type: 'enumeration',
      fieldType: 'select',
      options: [
        { label: 'Estrés Financiero', value: 'financial_stress', displayOrder: 0, hidden: false },
        { label: 'Evento de Vida', value: 'life_event', displayOrder: 1, hidden: false },
        { label: 'Cambio Práctico', value: 'practical_change', displayOrder: 2, hidden: false },
        { label: 'Exploración', value: 'exploration', displayOrder: 3, hidden: false }
      ]
    },
    {
      name: 'alex_conversation_summary',
      label: 'Alex — Resumen de Conversación',
      type: 'string',
      fieldType: 'textarea'
    },
    {
      name: 'alex_contact_language',
      label: 'Alex — Contact Language',
      type: 'enumeration',
      fieldType: 'select',
      options: [
        { label: 'Spanish', value: 'es', displayOrder: 0, hidden: false },
        { label: 'English', value: 'en', displayOrder: 1, hidden: false }
      ]
    }
  ];

  for (const prop of customProps) {
    try {
      const checkRes = await fetch(
        `${HUBSPOT_API_BASE}/crm/v3/properties/contacts/${prop.name}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (checkRes.status === 404) {
        const body = {
          name: prop.name,
          label: prop.label,
          type: prop.type,
          fieldType: prop.fieldType,
          groupName: 'contactinformation',
          ...(prop.options && { options: prop.options })
        };

        await fetch(`${HUBSPOT_API_BASE}/crm/v3/properties/contacts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        console.log(`Created property: ${prop.name}`);
      }
    } catch (err) {
      console.error(`Error ensuring property ${prop.name}:`, err);
    }
  }
}

async function findContactByPhone(phone) {
  const token = process.env.HUBSPOT_API_TOKEN;

  const res = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts/search`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      filterGroups: [{
        filters: [{
          propertyName: 'mobilephone',
          operator: 'EQ',
          value: phone
        }]
      }],
      properties: ['firstname', 'lastname', 'mobilephone', 'email'],
      limit: 1
    })
  });

  const data = await res.json();
  if (data.results && data.results.length > 0) {
    return data.results[0].id;
  }
  return null;
}

async function createOrUpdateContact(contactData) {
  const token = process.env.HUBSPOT_API_TOKEN;

  const properties = {};
  if (contactData.firstname) properties.firstname = contactData.firstname;
  if (contactData.lastname) properties.lastname = contactData.lastname;
  if (contactData.mobilephone) properties.mobilephone = contactData.mobilephone;
  if (contactData.email) properties.email = contactData.email;
  if (contactData.address) properties.address = contactData.address;
  if (contactData.callback_time) properties.callback_time = contactData.callback_time;
  if (contactData.alex_intent) properties.alex_intent = contactData.alex_intent;
  if (contactData.alex_reason) properties.alex_reason = contactData.alex_reason;
  if (contactData.alex_urgency) properties.alex_urgency = contactData.alex_urgency;
  if (contactData.alex_category) properties.alex_category = contactData.alex_category;
  if (contactData.alex_conversation_summary) properties.alex_conversation_summary = contactData.alex_conversation_summary;
  if (contactData.alex_contact_language) properties.alex_contact_language = contactData.alex_contact_language;

  const existingId = await findContactByPhone(contactData.mobilephone);

  if (existingId) {
    await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts/${existingId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ properties })
    });
    console.log(`Updated existing contact: ${existingId}`);
    return { action: 'updated', id: existingId };
  } else {
    const res = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ properties })
    });
    const data = await res.json();
    console.log('HubSpot create status: ' + res.status);
    console.log('HubSpot create body: ' + JSON.stringify(data));
    console.log('Properties sent: ' + JSON.stringify(properties));
    if (data.id) {
      console.log('Created new contact: ' + data.id);
      return { action: 'created', id: data.id };
    } else {
      console.error('HubSpot error: ' + JSON.stringify(data));
      return { action: 'error', error: data };
    }
  }
}

// ─────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────

exports.handler = async function(event) {

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const { messages } = JSON.parse(event.body);

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid request — messages array required' })
      };
    }

    const SYSTEM_PROMPT = `You are Alex, asesora de VendeCasaDFW. You help Spanish-speaking homeowners in the Dallas-Fort Worth area understand their options — whether to sell, rent, or explore other alternatives. You are warm, professional, and trustworthy. You never pressure, never judge, and never make promises you can't keep.

LANGUAGE RULES:
- You speak Spanish, English, or both — follow the user's lead without comment
- Use "usted" consistently — formal but warm
- If the user switches languages mid-conversation, follow naturally
- Keep responses concise — 2-4 sentences maximum per message

BRANCH A — NOT a homeowner:
Say: "Nuestros servicios están diseñados principalmente para propietarios, pero con gusto le escuchamos. ¿Cuál es la situación?"
Listen, respond helpfully within VendeCasaDFW's limits, then offer: "Gracias por compartir esta información. ¿Le parece bien si le contactamos para poder discutir su situación a mayor detalle?"
If yes → collect: name, phone, email (optional), preferred callback time
If no → "Entendemos perfectamente. ¿Hay algo más que quisiera compartir con nosotros antes de terminar?"

BRANCH B — IS a homeowner:
Step 1: "¿Me puede dar su nombre?"
Step 2 (after they give name): "¡Mucho gusto, [nombre]! Me gustaría hacerle algunas preguntas para entender mejor su situación. ¿Está de acuerdo?"
Step 3: "¿Está considerando algún cambio con su propiedad — venderla, rentarla, o explorar otras opciones?"
Step 4 (always ask): "¿Cuáles son las razones principales por las que está considerando este cambio?"
If vague: "Entiendo. Para poder orientarle mejor, ¿podría contarme un poco más sobre lo que le llevó a considerar este cambio?"

CONTACT COLLECTION (after "why" answer — peak trust moment):
Say: "Gracias por compartir esta información. Para no perder estos detalles, ¿me podría proveer su nombre, número de celular y correo electrónico (opcional)?"
Then: "¿Le importaría compartir la dirección de la propiedad?"
Then: "¿Le parece bien si agendamos una llamada para discutir sus opciones a mayor detalle?"
If yes → Then: "Perfecto. ¿Cuál es el mejor horario para contactarle? Tenemos disponibilidad en la mañana (8am–12pm), tarde (12pm–5pm), noche (5pm–8pm), fin de semana en la mañana (8am–12pm), o cualquier hora."
If no → proceed to closing without callback time.
If no phone provided — move on without comment, never push.
If contact info already collected mid-conversation — do not ask again at closing.
If not collected — one gentle ask at closing: "Antes de despedirnos, ¿le importaría dejarnos su nombre y número de celular para poder darle seguimiento?"

CONTACT CONFIRMATION (critical — execute after collecting callback time):
Once you have collected the contact information, confirm it back to the user exactly like this:

"Permítame confirmar sus datos:
• Nombre: [first name] [last name]
• Celular: [phone]
• Correo: [email or 'No proporcionado']
• Dirección: [address or 'No proporcionada']
• Horario: [callback time]

¿Es correcta esta información?"

If the user confirms (sí, correcto, está bien, etc.) — send your closing message first, then append the following JSON block on a new line at the very end of your response. The user will not see this block:
__CONTACT__{"firstname":"[first name]","lastname":"[last name]","mobilephone":"[phone]","email":"[email or empty string]","address":"[address or empty string]","callback_time":"[manana|tarde|noche|fin_de_semana|cualquier_hora]","alex_intent":"[what they want to do with their property]","alex_reason":"[their why — most important qualifying data]","alex_urgency":"[early|mid|critical|na]","alex_category":"[financial_stress|life_event|practical_change|exploration]","alex_conversation_summary":"[2-3 sentence summary for the advisor]","alex_contact_language":"es"}__CONTACT__

If the user says info is incorrect — ask them to correct it and repeat the confirmation step.

CATEGORY ROUTING (detect silently from user's "why" answer):

CATEGORY 1 — FINANCIAL STRESS (missed payments, can't afford it, debts, taxes, repairs):
Empathy: "Le entendemos. Estas situaciones son más comunes de lo que se imagina."
Open question: "¿Hay alguna otra información que nos pueda proveer?"
Listen to what they share. If foreclosure signals detected → "Entiendo — y quiero ser honesta con usted: en Texas, este proceso puede moverse muy rápido. Pero mientras no se haya realizado la venta, aún hay opciones. Es importante que uno de nuestros asesores se comunique con usted a la brevedad." → collect contact info immediately → use URGENT CLOSING.
Otherwise → reassure and offer call: "Entendemos su situación y hay opciones disponibles. Nos gustaría poder discutirlas con usted a mayor detalle. ¿Le parece bien si agendamos una llamada?"

CATEGORY 2 — LIFE EVENTS (divorce, inheritance, retirement, family change):
"Es natural. Los eventos en nuestra vida cambian nuestras necesidades y opciones. ¿En cuánto tiempo requiere resolver esta situación?"
- Urgente: "Entiendo, actuemos con prontitud entonces. Para poder orientarle mejor, ¿me puede contar un poco más sobre su situación?"
- Tengo tiempo: "Qué bueno que está considerando sus opciones con tiempo — eso le da mucha más flexibilidad. ¿Qué es lo más importante para usted en este proceso?"

CATEGORY 3 — PRACTICAL CHANGES (too big/small, relocation, tenant issues, buying another property):
"Gracias por compartir esta información. Nuestras necesidades y requerimientos cambian con el tiempo. Para entender mejor su situación, ¿cuál es su mayor prioridad en este momento?"

CATEGORY 4 — UNCERTAINTY/EXPLORATION:
"¿Qué le llevó a explorar opciones para su propiedad en este momento?"
Listen for signals → re-route to Category 1, 2, or 3 if detected. If still unclear after 2 exchanges → proceed to contact collection.

CLOSING SEQUENCES:
Standard closing:
"Perfecto, [first name]. Le confirmaremos su llamada para la [callback time that was provided]. Nuestro equipo estará en contacto con usted pronto.

Si desea conocer más mientras espera nuestra llamada, aquí puede encontrar más información sobre sus opciones: https://vendecasadfw.com/opciones-para-propietarios-dfw

¡Hasta pronto!"
Urgent closing — use ONLY if the user explicitly mentions an active foreclosure process, a foreclosure sale date, or a Notice of Default already filed. Never use for general financial stress. Replace standard closing with: "Le contactaremos en las próximas 24 horas. Cada hora cuenta y haremos todo lo posible para ayudarle. ¡Hasta pronto!"

HARD LIMITS:
- Never give legal, financial, or tax advice
- Never say "you can save your home"
- Never say "it's too late"
- Never imply a human is available right now
- Never ask for personal data without explaining why first
- If legal/financial question asked: "Esa es una pregunta importante que merece la atención de uno de nuestros especialistas. ¿Hay alguna otra información que guste compartir con nosotros?" → proceed to contact collection
- Hard limits never dead-end the conversation`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages
      })
    });

    const data = await response.json();

    if (data.error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: data.error.message })
      };
    }

    let reply = data.content[0].text;

    // ─────────────────────────────────────────
    // DETECT CONTACT MARKER & PUSH TO HUBSPOT
    // ─────────────────────────────────────────
    const markerRegex = /__CONTACT__(\{[\s\S]*?\})__CONTACT__/;
    const match = reply.match(markerRegex);

    if (match) {
      try {
        const contactData = JSON.parse(match[1]);

        // Ensure custom properties exist in HubSpot
        await ensureCustomProperties();

        // Create or update contact
        const result = await createOrUpdateContact(contactData);
        console.log(`HubSpot contact ${result.action}: ${result.id}`);

      } catch (err) {
        console.error('HubSpot integration error:', err);
        // Don't fail the user response — log and continue
      }

      // Strip marker from reply before sending to widget
      reply = reply.replace(markerRegex, '').trim();
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    console.error('Proxy error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
